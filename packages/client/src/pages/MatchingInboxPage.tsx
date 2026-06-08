import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PageLayout,
  Avatar,
  Badge,
  BottomNav,
  EmptyState,
  Button,
  Divider,
  Caption,
  Tabs,
} from "@ui";
import { useAuthStore } from "../store/auth";
import { useMatchStore } from "../store/matchStore";
import type { MockMatching } from "../lib/mockData";

type StatusFilter = "all" | "pending" | "accepted" | "rejected";

const STATUS_TABS = [
  { id: "all", label: "전체" },
  { id: "pending", label: "대기중" },
  { id: "accepted", label: "수락됨" },
  { id: "rejected", label: "거절됨" },
];

const STATUS_LABEL: Record<string, string> = {
  pending: "대기중",
  accepted: "수락됨",
  rejected: "거절됨",
  cancelled: "취소됨",
};

const STATUS_VARIANT: Record<string, "default" | "muted" | "outline"> = {
  pending: "outline",
  accepted: "default",
  rejected: "muted",
  cancelled: "muted",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}시간 전`;
  return `${Math.floor(hrs / 24)}일 전`;
}

function MatchingRow({
  matching,
  isDesigner,
  onClick,
}: {
  matching: MockMatching;
  isDesigner: boolean;
  onClick: () => void;
}) {
  const name = isDesigner ? matching.modelName : matching.designerName;
  const sub = matching.treatmentStyle;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-hover transition-colors text-left"
    >
      <Avatar name={name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-sm text-charcoal">{name}</p>
        <p className="font-sans text-xs text-muted mt-0.5 truncate">{sub}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <Badge variant={STATUS_VARIANT[matching.status]}>
          {STATUS_LABEL[matching.status]}
        </Badge>
        <Caption>{timeAgo(matching.createdAt)}</Caption>
      </div>
    </button>
  );
}

export function MatchingInboxPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { modelMatchings, designerMatchings } = useMatchStore();
  const [tab, setTab] = useState<StatusFilter>("all");

  const isDesigner = user?.role === "designer";
  const allMatchings = isDesigner ? designerMatchings : modelMatchings;

  const filtered = allMatchings.filter(
    (m) => tab === "all" || m.status === tab
  );

  const tabsWithCount = STATUS_TABS.map((t) => ({
    ...t,
    count:
      t.id === "all"
        ? undefined
        : allMatchings.filter((m) => m.status === t.id).length,
  }));

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <div className="flex items-center justify-between px-5 py-4">
          <p className="font-sans font-semibold text-base text-charcoal">
            {isDesigner ? "매칭 신청함" : "내 신청"}
          </p>
          {!isDesigner && (
            <Link to="/discover">
              <Button variant="ghost" size="sm">디자이너 탐색</Button>
            </Link>
          )}
        </div>
      }
      footer={<BottomNav />}
    >
      <div className="max-w-[430px] mx-auto">
        <Tabs
          tabs={tabsWithCount}
          active={tab}
          onChange={(id) => setTab(id as StatusFilter)}
        />

        <div className="pb-6">
          {filtered.length === 0 ? (
            <EmptyState
              title={
                tab === "all"
                  ? isDesigner
                    ? "아직 신청이 없어요"
                    : "아직 신청한 매칭이 없어요"
                  : `${STATUS_LABEL[tab]} 매칭이 없어요`
              }
              description={
                tab === "all" && !isDesigner
                  ? "디자이너를 탐색하고 첫 매칭을 시작해보세요"
                  : undefined
              }
              action={
                tab === "all" && !isDesigner ? (
                  <Link to="/discover">
                    <Button variant="primary" size="sm">디자이너 탐색</Button>
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <div>
              {filtered.map((m, i) => (
                <div key={m.id}>
                  <MatchingRow
                    matching={m}
                    isDesigner={isDesigner}
                    onClick={() => navigate(`/matching/${m.id}`)}
                  />
                  {i < filtered.length - 1 && <Divider className="mx-5" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
