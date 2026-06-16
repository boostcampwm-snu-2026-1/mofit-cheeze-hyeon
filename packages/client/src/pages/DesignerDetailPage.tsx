import { useState } from "react";
import { useParams } from "react-router-dom";
import { useVtNavigate } from "@ui";
import {
  PageLayout,
  PageHeader,
  Avatar,
  Button,
  Badge,
  Divider,
  Body,
  Caption,
  EmptyState,
} from "@ui";
import { MOCK_DESIGNERS } from "../lib/mockData";
import { formatSlot } from "../lib/date";
import { useAuthStore } from "../store/auth";

export function DesignerDetailPage() {
  const navigate = useVtNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const d = MOCK_DESIGNERS.find((des) => des.id === id) ?? MOCK_DESIGNERS[0];

  return (
    <>
      <PageLayout
        fullWidth
        className="p-0 py-0"
        header={<PageHeader title={d.name} onBack={() => navigate(-1)} />}
      >
        <div className="max-w-[430px] mx-auto px-5 pt-6 pb-10">
          {/* Profile header */}
          <div className="flex flex-col items-center text-center mb-8">
            <Avatar name={d.name} size="xl" className="mb-4" />
            <p className="font-sans font-semibold text-xl text-charcoal tracking-[-0.4px]">
              {d.name}
            </p>
            <p className="font-sans text-sm text-muted mt-1">{d.specialty}</p>
            <div className="flex items-center gap-4 mt-3">
              <Caption>{d.region}</Caption>
              <Caption>경력 {d.career}</Caption>
              <Caption>★ {d.rating} ({d.matchCount}회)</Caption>
            </div>
          </div>

          {/* Recruit info */}
          <div className="rounded-card border border-border p-4 mb-6 flex flex-col gap-3">
            <p className="font-sans text-sm font-semibold text-charcoal">모집 정보</p>
            <div className="flex items-center justify-between">
              <Caption>시술 스타일</Caption>
              <p className="font-sans text-sm font-medium text-charcoal text-right">
                {d.recruitStyle}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Caption>제안 비용</Caption>
              <p className="font-sans text-sm font-medium text-charcoal">
                {d.proposedPrice === 0 ? "무료 협업" : `${d.proposedPrice.toLocaleString()}원`}
              </p>
            </div>
            <div>
              <Caption className="block mb-2">가능한 날짜</Caption>
              <div className="flex flex-wrap gap-2">
                {d.availableSlots.map((slot) => (
                  <Badge key={slot} variant="outline">
                    {formatSlot(slot)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          {user?.role === "model" && (
            <div className="flex gap-2 mb-8">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => navigate(`/match/apply/${d.id}`)}
              >
                매칭 신청
              </Button>
            </div>
          )}

          {/* Specialties */}
          <Divider className="mb-6" />
          <div className="mb-6">
            <p className="font-sans font-semibold text-sm text-charcoal mb-3">
              전문 분야
            </p>
            <div className="flex flex-wrap gap-2">
              {d.specialties.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Content usage conditions */}
          {(d.allowContentUsage || d.allowFaceExposure) && (
            <>
              <Divider className="mb-6" />
              <div className="mb-6">
                <p className="font-sans font-semibold text-sm text-charcoal mb-3">
                  촬영 조건
                </p>
                <div className="flex flex-col gap-2">
                  {d.allowContentUsage && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-charcoal">✓</span>
                      <Caption>콘텐츠 활용 동의 — SNS·포트폴리오 게시 가능</Caption>
                    </div>
                  )}
                  {d.allowFaceExposure && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-charcoal">✓</span>
                      <Caption>얼굴 공개 동의</Caption>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Bio */}
          <Divider className="mb-6" />
          <div className="mb-6">
            <p className="font-sans font-semibold text-sm text-charcoal mb-3">
              소개
            </p>
            <Body className="text-muted leading-relaxed">{d.bio}</Body>
          </div>

          {/* Portfolio */}
          <Divider className="mb-6" />
          <div className="mb-6">
            <p className="font-sans font-semibold text-sm text-charcoal mb-4">
              포트폴리오
            </p>

            {d.portfolios.length === 0 ? (
              <EmptyState
                title="포트폴리오가 없어요"
                description="아직 등록된 시술 사례가 없습니다"
              />
            ) : (
              <div className="flex flex-col gap-5">
                {d.portfolios.map((p) => (
                  <div key={p.id}>
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="font-sans text-sm font-medium text-charcoal">{p.title}</p>
                      {p.description && (
                        <Caption className="text-muted">{p.description}</Caption>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-0.5 rounded-compact overflow-hidden">
                      {p.imageUrls.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setLightboxUrl(url)}
                          className="aspect-square overflow-hidden block"
                        >
                          <img
                            src={url}
                            alt={`${p.title} ${i + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews — only show if exist */}
          {d.reviews.length > 0 && (
            <>
              <Divider className="mb-6" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="font-sans font-semibold text-sm text-charcoal">리뷰</p>
                  <Caption>★ {d.rating} · {d.reviews.length}개</Caption>
                </div>
                <div className="flex flex-col gap-3">
                  {d.reviews.map((r) => (
                    <div key={r.id} className="rounded-card border border-border p-3.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-sans text-sm font-medium text-charcoal">{r.reviewer}</p>
                        <Caption>{"★".repeat(r.rating)}</Caption>
                      </div>
                      <Caption className="mb-2 text-muted">{r.treatmentStyle}</Caption>
                      <Body className="text-charcoal leading-relaxed">{r.comment}</Body>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </PageLayout>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/90 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-9 h-9 rounded-pill bg-offwhite/20 text-offwhite flex items-center justify-center"
            onClick={() => setLightboxUrl(null)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxUrl}
            alt=""
            className="max-w-full max-h-full object-contain rounded-card"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
