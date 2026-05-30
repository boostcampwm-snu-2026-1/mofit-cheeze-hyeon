-- ============================================================
-- 모핏 초기 스키마
-- Supabase SQL Editor 또는 migration 툴로 실행
-- ============================================================

-- auth.users는 Supabase Auth가 관리, 비즈니스 데이터는 public에 분리

CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('model', 'designer')),
  name        TEXT NOT NULL,
  avatar_key  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.model_profiles (
  user_id                   UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  gender                    TEXT CHECK (gender IN ('female', 'male', 'other')),
  age_group                 TEXT,
  preferred_styles          TEXT[] NOT NULL DEFAULT '{}',
  has_treatment_experience  BOOLEAN NOT NULL DEFAULT FALSE,
  bio                       TEXT,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.designer_profiles (
  user_id               UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  salon_name            TEXT,
  region                TEXT NOT NULL,
  career                TEXT NOT NULL,
  specialties           TEXT[] NOT NULL DEFAULT '{}',
  allow_content_usage   BOOLEAN NOT NULL DEFAULT FALSE,
  allow_face_exposure   BOOLEAN NOT NULL DEFAULT FALSE,
  bio                   TEXT,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.portfolios (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.portfolio_images (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  storage_key  TEXT NOT NULL,
  order_index  INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE matching_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

CREATE TABLE public.matchings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id              UUID NOT NULL REFERENCES public.users(id),
  designer_id           UUID NOT NULL REFERENCES public.users(id),
  status                matching_status NOT NULL DEFAULT 'pending',
  treatment_style       TEXT NOT NULL,
  reference_image_keys  TEXT[] NOT NULL DEFAULT '{}',
  available_dates       TEXT[] NOT NULL DEFAULT '{}',
  proposed_price        INT NOT NULL DEFAULT 0,
  allow_content_usage   BOOLEAN NOT NULL DEFAULT FALSE,
  allow_face_exposure   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.chat_rooms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matching_id     UUID NOT NULL UNIQUE REFERENCES public.matchings(id) ON DELETE CASCADE,
  last_message    TEXT,
  last_message_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE message_type AS ENUM ('text', 'image', 'reservation_proposal', 'reservation_confirmed');

CREATE TABLE public.messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id          UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id        UUID NOT NULL REFERENCES public.users(id),
  type             message_type NOT NULL DEFAULT 'text',
  content          TEXT NOT NULL DEFAULT '',
  image_key        TEXT,
  reservation_data JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE reservation_status AS ENUM ('confirmed', 'changed', 'cancelled', 'completed');

CREATE TABLE public.reservations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matching_id  UUID NOT NULL REFERENCES public.matchings(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  location     TEXT,
  status       reservation_status NOT NULL DEFAULT 'confirmed',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matching_id UUID NOT NULL UNIQUE REFERENCES public.matchings(id) ON DELETE CASCADE,
  model_id    UUID NOT NULL REFERENCES public.users(id),
  designer_id UUID NOT NULL REFERENCES public.users(id),
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.review_replies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id  UUID NOT NULL UNIQUE REFERENCES public.reviews(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM (
  'matching_request', 'matching_accepted', 'matching_rejected',
  'new_message', 'reservation_confirmed', 'reservation_changed',
  'reservation_cancelled', 'review_requested'
);

CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  ref_id      UUID,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.blocks (
  blocker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

CREATE TYPE report_status AS ENUM ('received', 'in_progress', 'resolved');
CREATE TYPE report_target AS ENUM ('profile', 'chat', 'review');

CREATE TABLE public.reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.users(id),
  target_type report_target NOT NULL,
  target_id   UUID NOT NULL,
  reason      TEXT NOT NULL,
  detail      TEXT,
  status      report_status NOT NULL DEFAULT 'received',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX ON public.matchings (model_id);
CREATE INDEX ON public.matchings (designer_id);
CREATE INDEX ON public.matchings (status);
CREATE INDEX ON public.messages (room_id, created_at DESC);
CREATE INDEX ON public.notifications (user_id, created_at DESC);
CREATE INDEX ON public.blocks (blocker_id);
