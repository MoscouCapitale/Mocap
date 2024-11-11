alter table "public"."Settings" drop constraint "Settings_user_fkey";

alter table "public"."Artist" disable row level security;

alter table "public"."Bricks_Album" disable row level security;

alter table "public"."Bricks_Album_Platform_Link" disable row level security;

alter table "public"."Bricks_Album_Track" disable row level security;

alter table "public"."Bricks_HeroSection" disable row level security;

alter table "public"."Bricks_Single" disable row level security;

alter table "public"."Bricks_Single_Platform_Link" disable row level security;

alter table "public"."Bricks_Text" disable row level security;

alter table "public"."Platform" disable row level security;

alter table "public"."Platform_Link" disable row level security;

alter table "public"."Settings" disable row level security;

alter table "public"."Track" disable row level security;

alter table "public"."Track_Artist" disable row level security;

alter table "public"."Track_Platform_Link" disable row level security;

alter table "public"."base_brick" disable row level security;

alter table "public"."Settings" add constraint "Settings_user_fkey1" FOREIGN KEY ("user") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Settings" validate constraint "Settings_user_fkey1";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email text)
 RETURNS TABLE(id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = $1;
END;
$function$
;


