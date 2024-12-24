alter table "public"."Medias" drop constraint "medias_controls_fkey";

alter table "public"."Medias" drop constraint "medias_cover_fkey";

alter table "public"."Medias" drop constraint "medias_cta_fkey";

alter table "public"."Bricks_Album" add column "controls" jsonb;

alter table "public"."Bricks_Album" add column "mediaFit" media_fit default 'best'::media_fit;

alter table "public"."Bricks_HeroSection" add column "controls" jsonb;

alter table "public"."Bricks_HeroSection" add column "mediaFit" media_fit not null default 'best'::media_fit;

alter table "public"."Bricks_Highlight" add column "controls" jsonb;

alter table "public"."Bricks_Highlight" add column "mediaFit" media_fit not null default 'best'::media_fit;

alter table "public"."Bricks_Single" add column "controls" jsonb;

alter table "public"."Bricks_Single" add column "mediaFit" media_fit not null default 'best'::media_fit;

alter table "public"."Medias" drop column "autoplay";

alter table "public"."Medias" drop column "controls";

alter table "public"."Medias" drop column "cover";

alter table "public"."Medias" drop column "cta";

alter table "public"."Medias" drop column "object_fit";


