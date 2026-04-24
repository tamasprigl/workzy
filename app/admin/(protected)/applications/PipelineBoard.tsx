"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStartEvent, 
  DragEndEvent, 
  DragOverEvent,
  useDroppable,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface ApplicantRecord {
  id: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  access: string;
  cv: any;
  createdDate: string;
}

const COLUMNS = ["Új", "Feldolgozás alatt", "Felvéve", "Elutasítva"];

const STATUS_COLORS: Record<string, string> = {
  "Új": "border-l-slate-300",
  "Feldolgozás alatt": "border-l-amber-400",
  "Felvéve": "border-l-emerald-400",
  "Elutasítva": "border-l-rose-400",
};

export default function PipelineBoard({ initialRecords }: { initialRecords: ApplicantRecord[] }) {
  const [cards, setCards] = useState<ApplicantRecord[]>(initialRecords);
  const [activeCard, setActiveCard] = useState<ApplicantRecord | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    setCards(initialRecords);
  }, [initialRecords]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    setActiveCard(cards.find(c => c.id === active.id) || null);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isOverTask) {
      setCards((items) => {
        const oldIndex = items.findIndex((x) => x.id === activeId);
        const newIndex = items.findIndex((x) => x.id === overId);
        const oldCard = items[oldIndex];
        const newCard = items[newIndex];
        
        if (oldCard.status !== newCard.status) {
          const updatedCard = { ...oldCard, status: newCard.status };
          const newItems = [...items];
          newItems[oldIndex] = updatedCard;
          return arrayMove(newItems, oldIndex, newIndex);
        }
        
        return arrayMove(items, oldIndex, newIndex);
      });
    } else if (isOverColumn) {
      setCards((items) => {
        const oldIndex = items.findIndex((x) => x.id === activeId);
        const oldCard = items[oldIndex];
        const newStatus = over.data.current?.status;
        
        if (oldCard.status !== newStatus) {
           const newItems = [...items];
           newItems[oldIndex] = { ...oldCard, status: newStatus };
           return arrayMove(newItems, oldIndex, newItems.length - 1);
        }
        return items;
      });
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active } = e;
    setActiveCard(null);

    const cardId = active.id as string;
    const currentCard = cards.find(c => c.id === cardId);
    if (!currentCard) return;

    const originalCard = initialRecords.find(c => c.id === cardId);
    
    // Only API update if status changed bounds
    if (!originalCard || originalCard.status === currentCard.status) return;

    setSavingId(cardId);
    try {
      const res = await fetch("/api/applications/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId: cardId, status: currentCard.status })
      });
      
      if (!res.ok) throw new Error("Airtable update failed");
    } catch (err) {
      console.error(err);
      alert("Hiba történt. Próbáld újra.");
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: originalCard.status } : c));
    } finally {
      setSavingId(null);
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-6 w-full pb-4 items-start xl:justify-between hide-scrollbar">
        {COLUMNS.map(col => (
          <BoardColumn key={col} id={col} title={col} cards={cards.filter(c => c.status === col)} savingId={savingId} />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeCard ? <ApplicantCard card={activeCard} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function BoardColumn({ id, title, cards, savingId }: { id: string; title: string; cards: ApplicantRecord[], savingId: string | null }) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { type: "Column", status: id } });

  return (
    <div 
      ref={setNodeRef} 
      className={`snap-start flex-1 min-w-[280px] lg:max-w-[350px] flex flex-col bg-white border border-slate-200 rounded-2xl p-4 min-h-[400px] transition-all duration-200 ease-out ${isOver ? 'bg-sky-50 ring-2 ring-sky-200 shadow-inner' : 'shadow-[0_18px_45px_rgba(15,23,42,0.03)]'}`}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800 tracking-tight">{title}</h3>
        <span className="bg-slate-100 text-slate-600 text-sm font-medium px-2.5 py-0.5 rounded-full border border-slate-200 shadow-sm">
          {cards.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1 h-full max-h-[70vh] overflow-y-auto pr-1">
        <SortableContext items={cards.map(c=>c.id)} strategy={verticalListSortingStrategy}>
          {cards.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[200px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-slate-300"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="font-medium text-slate-600">Nincs jelentkező</span>
              <span className="text-xs mt-1">Húzz ide jelentkezőket</span>
            </div>
          ) : (
            cards.map(card => <ApplicantCard key={card.id} card={card} isSaving={savingId === card.id} />)
          )}
        </SortableContext>
      </div>
    </div>
  );
}

function ApplicantCard({ card, isOverlay = false, isSaving = false }: { card: ApplicantRecord; isOverlay?: boolean; isSaving?: boolean }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, isDragging, transition } = useSortable({
    id: card.id,
    data: { type: "Task", card },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const statusColor = STATUS_COLORS[card.status] || "border-l-slate-300";

  const handleCardClick = () => {
    if (!isDragging && !isOverlay) {
      router.push(`/admin/applications/${card.id}`);
    }
  };

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="h-[120px] rounded-xl border border-sky-400 border-dashed bg-sky-50 opacity-60 transition-all duration-150 animate-pulse" 
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleCardClick}
      className={`relative bg-white rounded-xl border-y border-r border-l-4 border-slate-200 p-4 transition-all duration-150 ease-out select-none cursor-pointer group ${statusColor} ${isOverlay ? 'rotate-2 shadow-xl scale-105 z-50 opacity-90 cursor-grabbing ring-2 ring-sky-300' : 'shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-y-slate-300 hover:border-r-slate-300'} ${isSaving ? 'opacity-70 pointer-events-none' : ''}`}
    >
      {isSaving && (
        <div className="absolute top-3 right-3 text-cyan-500">
           <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1 pr-2">
          <h4 className="font-bold text-slate-900 truncate leading-tight transition-colors group-hover:text-cyan-600" title={card.fullName}>
            {card.fullName}
          </h4>
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 tracking-wider">
            {card.jobTitle}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap shrink-0 pt-0.5">{card.createdDate}</span>
      </div>
      
      <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-slate-50">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <svg className="text-slate-400 shrink-0 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span className="truncate">{card.email || "Nincs email"}</span>
        </div>
        {card.phone && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <svg className="text-slate-400 shrink-0 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            <span className="truncate">{card.phone}</span>
          </div>
        )}
      </div>

      {card.cv && Array.isArray(card.cv) && card.cv.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-cyan-600">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
          Önéletrajz csatolva
        </div>
      )}
    </div>
  );
}
