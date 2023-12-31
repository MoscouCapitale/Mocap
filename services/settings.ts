import { supabase as sup } from "@services/supabase.ts";

const mainSettings = ('email_contact,email_user_creator,email_logging,email_administrator,email_default_sender,api_spotify,api_deezer,api_soundcloud,api_amazon_music,api_youtube_music,api_tidal,website_url,website_title,website_icone,website_keywords,website_language')
const mediasSettings = ('media_max_size_mb, media_max_size_height, media_auto_optimize, media_lazyload')
const stylesSettings = ('style_color_auto,style_color_main,style_color_secondary,style_theme_toggle,style_font_main,style_font_secondary')
const miscSettings = ('misc_confidentiality')

const retrieveAll = async () => {
  return await retrieveColumns('*');
};

const retrieveMain = async () => {
    return await retrieveColumns(mainSettings);
};

const retrieveMedias = async () => {
    return await retrieveColumns(mediasSettings);
};

const retrieveStyles = async () => {
    return await retrieveColumns(stylesSettings);
};

const retrieveMisc = async () => {
    return await retrieveColumns(miscSettings);
};

const retrieveColumns = async (columns: string) => {
    const res = await sup.from("Website_Settings")
        .select(columns);
    return res.data;
};

export {
    retrieveAll,
    retrieveMain,
    retrieveMedias,
    retrieveStyles,
    retrieveMisc
}