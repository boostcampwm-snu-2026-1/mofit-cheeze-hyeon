import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PageLayout,
  Avatar,
  Button,
  Badge,
  Divider,
  Body,
  Caption,
  EmptyState,
} from "@ui";
import { MOCK_DESIGNERS } from "../lib/mockData";
import { useAuthStore } from "../store/auth";

export function DesignerDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [activePortfolio, setActivePortfolio] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const d = MOCK_DESIGNERS.find((des) => des.id === id) ?? MOCK_DESIGNERS[0];

  const openPortfolio = (portfolioId: string) => {
    setActivePortfolio(portfolioId);
    setActiveImageIndex(0);
  };

  const portfolio = d.portfolios.find((p) => p.id === activePortfolio);

  return (
    <PageLayout
      fullWidth
      className="p-0 py-0"
      header={
        <div className="flex items-center px-5 py-4">
          <button
            onClick={() => navigate(-1)}
            className="font-sans text-sm text-muted hover:text-charcoal transition-colors mr-4"
          >
            ←
          </button>
          <p className="font-sans font-semibold text-base text-charcoal">
            {d.name}
          </p>
        </div>
      }
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
            <Caption>★ {d.rating}</Caption>
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
            <div className="flex flex-col gap-3">
              {d.portfolios.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    activePortfolio === p.id
                      ? setActivePortfolio(null)
                      : openPortfolio(p.id)
                  }
                  className="w-full text-left rounded-card border border-border hover:border-border-interactive transition-colors overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3">
                    {p.imageUrls[0] && (
                      <img
                        src={p.imageUrls[0]}
                        alt=""
                        className="w-16 h-16 rounded-compact object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-sm text-charcoal">
                        {p.title}
                      </p>
                      {p.description && (
                        <p className="font-sans text-xs text-muted mt-0.5 truncate">
                          {p.description}
                        </p>
                      )}
                      <Caption className="mt-1">사진 {p.imageUrls.length}장</Caption>
                    </div>
                    <span className="font-sans text-sm text-muted flex-shrink-0">
                      {activePortfolio === p.id ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Expanded gallery */}
                  {activePortfolio === p.id && portfolio && (
                    <div className="border-t border-border">
                      <div className="relative">
                        <img
                          src={portfolio.imageUrls[activeImageIndex]}
                          alt={portfolio.title}
                          className="w-full aspect-square object-cover"
                        />
                        {portfolio.imageUrls.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndex((i) =>
                                  i === 0 ? portfolio.imageUrls.length - 1 : i - 1
                                );
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-pill bg-charcoal/60 text-offwhite flex items-center justify-center text-sm"
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndex((i) =>
                                  i === portfolio.imageUrls.length - 1 ? 0 : i + 1
                                );
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-pill bg-charcoal/60 text-offwhite flex items-center justify-center text-sm"
                            >
                              ›
                            </button>
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                              {portfolio.imageUrls.map((_, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImageIndex(i);
                                  }}
                                  className={[
                                    "w-1.5 h-1.5 rounded-pill transition-colors",
                                    i === activeImageIndex
                                      ? "bg-offwhite"
                                      : "bg-offwhite/50",
                                  ].join(" ")}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      {portfolio.description && (
                        <p className="font-sans text-xs text-muted px-3 py-2">
                          {portfolio.description}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reviews placeholder */}
        <Divider className="mb-6" />
        <div>
          <p className="font-sans font-semibold text-sm text-charcoal mb-3">
            리뷰
          </p>
          <div className="rounded-card border border-border p-4 text-center">
            <Caption className="text-muted">
              리뷰는 매칭 완료 후 작성할 수 있어요 (Phase 4)
            </Caption>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
