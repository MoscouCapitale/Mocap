alter table "public"."Bricks_Audio" add column "controls" jsonb;

alter table "public"."Bricks_Audio" add column "mediaFit" media_fit default 'best'::media_fit;


