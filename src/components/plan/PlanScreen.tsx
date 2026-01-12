'use client';

import { useState, useEffect } from 'react';
import { PlanItem, AIPlanProposal, Group } from '@/types';
import { MOCK_AI_PROPOSALS } from '@/lib/mock-data';
import AIPlanSection from './AIPlanSection';
import PlanList from './PlanList';
import PlanDetailModal from './PlanDetailModal';
import AIGenerateModal from './AIGenerateModal';
import AIChatAdjustModal from './AIChatAdjustModal';
import FixConfirmModal from './FixConfirmModal';
import PlanMenuModal from './PlanMenuModal';

type DayType = '1DAY' | '2DAY' | '週末';

interface PlanScreenProps {
  plans: PlanItem[];
  currentGroup?: Group;
  onPlansChange?: (plans: PlanItem[]) => void;
}

export default function PlanScreen({ plans, currentGroup = 'family', onPlansChange }: PlanScreenProps) {
  // 状態管理
  const [localPlans, setLocalPlans] = useState<PlanItem[]>(plans);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showAISection, setShowAISection] = useState(true);

  // モーダル状態
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showFixModal, setShowFixModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [syncToGoogle, setSyncToGoogle] = useState(true);

  // AI提案関連
  const [selectedDayType, setSelectedDayType] = useState<DayType>('1DAY');
  const [generatedProposals, setGeneratedProposals] = useState<AIPlanProposal[]>([]);
  const [keptProposals, setKeptProposals] = useState<AIPlanProposal[]>(
    [MOCK_AI_PROPOSALS[currentGroup]?.[0]].filter(Boolean) as AIPlanProposal[]
  );
  const [adjustingProposal, setAdjustingProposal] = useState<AIPlanProposal | null>(null);

  useEffect(() => {
    setLocalPlans(plans);
  }, [plans]);

  const selectedPlan = selectedPlanId ? localPlans.find(p => p.id === selectedPlanId) : null;

  // AI提案を生成
  const generateProposals = () => {
    const proposals = MOCK_AI_PROPOSALS[currentGroup] || [];
    setGeneratedProposals(proposals);
  };

  // キープする
  const keepProposal = (proposal: AIPlanProposal) => {
    if (!keptProposals.find(p => p.id === proposal.id)) {
      setKeptProposals([...keptProposals, proposal]);
    }
    setGeneratedProposals(generatedProposals.filter(p => p.id !== proposal.id));
  };

  // キープ解除
  const removeKept = (proposalId: string) => {
    setKeptProposals(keptProposals.filter(p => p.id !== proposalId));
  };

  // AI提案を予定に変換
  const convertToPlan = (proposal: AIPlanProposal) => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const dateStr = nextWeek.toISOString().split('T')[0];

    const newPlan: PlanItem = {
      id: `plan-${Date.now()}`,
      groupId: currentGroup,
      title: proposal.title,
      dateStart: dateStr,
      status: 'planning',
      members: ['自分'],
      createdAt: new Date().toISOString(),
    };

    const updatedPlans = [...localPlans, newPlan];
    setLocalPlans(updatedPlans);
    onPlansChange?.(updatedPlans);
    setKeptProposals(keptProposals.filter(p => p.id !== proposal.id));
    setGeneratedProposals(generatedProposals.filter(p => p.id !== proposal.id));
  };

  // 調整モーダルを開く
  const openAdjustModal = (proposal: AIPlanProposal) => {
    setAdjustingProposal(proposal);
  };

  return (
    <div className="h-full pb-20 animate-fade-in">
      <div className="p-4 space-y-6">
        <AIPlanSection
          isOpen={showAISection}
          onToggle={() => setShowAISection(!showAISection)}
          keptProposals={keptProposals}
          onGenerateClick={() => {
            generateProposals();
            setShowGenerateModal(true);
          }}
          onConvertToPlan={convertToPlan}
          onAdjust={openAdjustModal}
          onRemoveKept={removeKept}
        />

        <PlanList
          plans={localPlans}
          onSelectPlan={setSelectedPlanId}
        />
      </div>

      <FixConfirmModal
        isOpen={showFixModal}
        onClose={() => setShowFixModal(false)}
        onConfirm={() => setShowFixModal(false)}
        syncToGoogle={syncToGoogle}
        onSyncToggle={() => setSyncToGoogle(!syncToGoogle)}
      />

      <PlanMenuModal
        isOpen={showMenuModal}
        onClose={() => setShowMenuModal(false)}
      />

      <AIGenerateModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        selectedDayType={selectedDayType}
        onDayTypeChange={setSelectedDayType}
        proposals={generatedProposals}
        onRegenerate={generateProposals}
        onKeep={keepProposal}
        onAdjust={openAdjustModal}
      />

      {adjustingProposal && (
        <AIChatAdjustModal
          proposal={adjustingProposal}
          onClose={() => setAdjustingProposal(null)}
          onKeep={keepProposal}
          onConvert={convertToPlan}
        />
      )}

      {selectedPlan && (
        <PlanDetailModal
          plan={selectedPlan}
          onClose={() => setSelectedPlanId(null)}
          onMenuClick={() => setShowMenuModal(true)}
          onFixClick={() => setShowFixModal(true)}
        />
      )}
    </div>
  );
}
