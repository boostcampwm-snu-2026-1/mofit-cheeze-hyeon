import { useParams } from "react-router-dom";
import { useVtNavigate } from "@ui";
import {
  PageLayout,
  PageHeader,
  Avatar,
  Badge,
  Button,
  Divider,
  Body,
  Caption,
} from "@ui";
import { useAuthStore } from "../store/auth";
import { useMatchStore } from "../store/matchStore";

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

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function MatchDetailPage() {
  const navigate = useVtNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { modelMatchings, designerMatchings, updateStatus, cancelMatching } = useMatchStore();

  const isDesigner = user?.role === "designer";
  const allMatchings = isDesigner ? designerMatchings : modelMatchings;
  const matching = allMatchings.find((m) => m.id === id);

  if (!matching) {
    return (
      <PageLayout
        fullWidth
        className="p-0 py-0"
        header={<PageHeader title="매칭 신청 상세" onBack={() => navigate(-1)} />}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Body className="text-muted">신청서를 찾을 수 없어요</Body>
        </div>
      </PageLayout>
    );
  }

  const counterpartName = isDesigner ? matching.modelName : matching.designerName;

  function handleAccept() {
    updateStatus(matching!.id, "accepted");
    navigate("/matching/inbox", { replace: true });
  }

  function handleReject() {
    updateStatus(matching!.id, "rejected");
    navigate("/matching/inbox", { replace: true });
  }

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={<PageHeader title="매칭 신청 상세" onBack={() => navigate(-1)} />}
    >
      <div className="w-full max-w-[430px] mx-auto px-5 py-6 flex flex-col">
        {/* Status + counterpart */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar name={counterpartName} size="md" />
            <div>
              <p className="font-sans font-medium text-sm text-charcoal">
                {counterpartName}
              </p>
              <Caption>{formatDate(matching.createdAt)}</Caption>
            </div>
          </div>
          <Badge variant={STATUS_VARIANT[matching.status]}>
            {STATUS_LABEL[matching.status]}
          </Badge>
        </div>

        <Divider className="mb-6" />

        <div className="flex flex-col gap-5">
          {/* Treatment style */}
          <div>
            <p className="font-sans text-xs font-medium text-muted mb-1">
              원하는 시술 스타일
            </p>
            <Body className="text-charcoal">{matching.treatmentStyle}</Body>
          </div>

          {/* Hair state — shown prominently so designer can decide */}
          {(matching.hairLength || matching.hairCondition || matching.currentColor) && (
            <div className="rounded-card border border-border bg-surface-subtle p-4">
              <p className="font-sans text-xs font-medium text-muted mb-3">현재 헤어 상태</p>
              <div className="flex flex-wrap gap-2">
                {matching.hairLength && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill border border-border font-sans text-xs text-charcoal">
                    <span className="text-muted">길이</span> {matching.hairLength}
                  </span>
                )}
                {matching.hairCondition && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill border border-border font-sans text-xs text-charcoal">
                    <span className="text-muted">상태</span> {matching.hairCondition}
                  </span>
                )}
                {matching.currentColor && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill border border-border font-sans text-xs text-charcoal">
                    <span className="text-muted">컬러</span> {matching.currentColor}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Memo */}
          {matching.memo && (
            <div>
              <p className="font-sans text-xs font-medium text-muted mb-1">
                상세 요청 메모
              </p>
              <Body className="text-charcoal leading-relaxed">{matching.memo}</Body>
            </div>
          )}

          <Divider />

          {/* Available dates */}
          <div>
            <p className="font-sans text-xs font-medium text-muted mb-2">
              가능한 날짜
            </p>
            <div className="flex flex-wrap gap-2">
              {matching.availableDates.map((d) => (
                <Badge key={d} variant="outline">{d}</Badge>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="font-sans text-xs font-medium text-muted mb-1">
              제안 비용
            </p>
            <Body className="text-charcoal">
              {matching.proposedPrice === 0
                ? "무료 협업"
                : `${matching.proposedPrice.toLocaleString()}원`}
            </Body>
          </div>

          <Divider />

          {/* Consent */}
          <div>
            <p className="font-sans text-xs font-medium text-muted mb-3">
              동의 조건
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-medium text-charcoal">콘텐츠 활용 동의</p>
                  <Caption>SNS·포트폴리오 활용 가능</Caption>
                </div>
                <Badge variant={matching.allowContentUsage ? "default" : "muted"}>
                  {matching.allowContentUsage ? "동의" : "비동의"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-sans text-sm font-medium text-charcoal">얼굴 공개 동의</p>
                <Badge variant={matching.allowFaceExposure ? "default" : "muted"}>
                  {matching.allowFaceExposure ? "동의" : "비동의"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isDesigner && matching.status === "pending" && (
          <div className="flex gap-2 mt-8">
            <Button
              variant="ghost"
              size="lg"
              className="flex-1"
              onClick={handleReject}
            >
              거절
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleAccept}
            >
              수락
            </Button>
          </div>
        )}

        {!isDesigner && matching.status === "pending" && (
          <div className="mt-8">
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={() => {
                cancelMatching(matching.id);
                navigate(-1);
              }}
            >
              신청 취소
            </Button>
          </div>
        )}

        {matching.status === "accepted" && (
          <div className="mt-8 flex flex-col gap-3 p-4 rounded-card border border-border text-center">
            <Caption className="text-muted">
              매칭이 수락되었어요. 채팅으로 일정을 조율해보세요.
            </Caption>
            <Button variant="primary" size="md" onClick={() => navigate(`/chat/${matching.id}`)}>
              채팅하기
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
