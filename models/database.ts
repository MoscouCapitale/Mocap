export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Artist: {
        Row: {
          created_at: string
          id: number
          name: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      Available_Languages: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      base_brick: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      Bricks_Album: {
        Row: {
          created_at: string
          cta: number | null
          hoverable: boolean
          id: number
          media: string | null
          name: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          cta?: number | null
          hoverable?: boolean
          id?: number
          media?: string | null
          name: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          cta?: number | null
          hoverable?: boolean
          id?: number
          media?: string | null
          name?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Bricks_Single_duplicate_cta_fkey"
            columns: ["cta"]
            isOneToOne: false
            referencedRelation: "CTA_Link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bricks_Single_duplicate_media_fkey"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Medias"
            referencedColumns: ["id"]
          },
        ]
      }
      Bricks_Album_Platform_Link: {
        Row: {
          Album: number
          Platform_Link: number
        }
        Insert: {
          Album: number
          Platform_Link: number
        }
        Update: {
          Album?: number
          Platform_Link?: number
        }
        Relationships: [
          {
            foreignKeyName: "Bricks_Album_Platform_Link_Album_fkey"
            columns: ["Album"]
            isOneToOne: false
            referencedRelation: "Bricks_Album"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bricks_Album_Platform_Link_Platform_Link_fkey"
            columns: ["Platform_Link"]
            isOneToOne: false
            referencedRelation: "Platform_Link"
            referencedColumns: ["id"]
          },
        ]
      }
      Bricks_Album_Track: {
        Row: {
          Album: number
          Track: number
        }
        Insert: {
          Album: number
          Track: number
        }
        Update: {
          Album?: number
          Track?: number
        }
        Relationships: [
          {
            foreignKeyName: "Bricks_Album_Track_Album_fkey"
            columns: ["Album"]
            isOneToOne: false
            referencedRelation: "Bricks_Album"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bricks_Album_Track_Track_fkey"
            columns: ["Track"]
            isOneToOne: false
            referencedRelation: "Track"
            referencedColumns: ["id"]
          },
        ]
      }
      Bricks_HeroSection: {
        Row: {
          created_at: string
          cta: number | null
          id: number
          media: string | null
          name: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          cta?: number | null
          id?: number
          media?: string | null
          name: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          cta?: number | null
          id?: number
          media?: string | null
          name?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Bricks_HeroSection_cta_fkey"
            columns: ["cta"]
            isOneToOne: false
            referencedRelation: "CTA_Link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bricks_HeroSection_media_fkey"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Medias"
            referencedColumns: ["id"]
          },
        ]
      }
      Bricks_Single: {
        Row: {
          created_at: string
          cta: number | null
          hoverable: boolean
          id: number
          media: string | null
          name: string
          title: string | null
          track: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          cta?: number | null
          hoverable?: boolean
          id?: number
          media?: string | null
          name: string
          title?: string | null
          track?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          cta?: number | null
          hoverable?: boolean
          id?: number
          media?: string | null
          name?: string
          title?: string | null
          track?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Bricks_Single_cta_fkey"
            columns: ["cta"]
            isOneToOne: false
            referencedRelation: "CTA_Link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bricks_Single_media_fkey"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Medias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bricks_Single_track_fkey"
            columns: ["track"]
            isOneToOne: false
            referencedRelation: "Track"
            referencedColumns: ["id"]
          },
        ]
      }
      Bricks_Single_Platform_Link: {
        Row: {
          Platform_Link: number
          Single: number
        }
        Insert: {
          Platform_Link: number
          Single: number
        }
        Update: {
          Platform_Link?: number
          Single?: number
        }
        Relationships: [
          {
            foreignKeyName: "Bricks_Single_Platform_Link_Platform_Link_fkey"
            columns: ["Platform_Link"]
            isOneToOne: false
            referencedRelation: "Platform_Link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bricks_Single_Platform_Link_Single_fkey"
            columns: ["Single"]
            isOneToOne: false
            referencedRelation: "Bricks_Single"
            referencedColumns: ["id"]
          },
        ]
      }
      Bricks_Text: {
        Row: {
          created_at: string
          id: number
          name: string
          special: string | null
          text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          special?: string | null
          text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          special?: string | null
          text?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      CTA_Link: {
        Row: {
          created_at: string | null
          hidden: boolean | null
          id: number
          label: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          hidden?: boolean | null
          id?: number
          label?: string
          updated_at?: string | null
          url?: string
        }
        Update: {
          created_at?: string | null
          hidden?: boolean | null
          id?: number
          label?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      Mail_Pairing: {
        Row: {
          email_recipient: string
          email_sender: string
          id: number
        }
        Insert: {
          email_recipient: string
          email_sender: string
          id?: number
        }
        Update: {
          email_recipient?: string
          email_sender?: string
          id?: number
        }
        Relationships: []
      }
      Media_Adjustement: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      Medias: {
        Row: {
          alt: string | null
          autodetect_source: boolean | null
          autoplay: boolean | null
          controls: number | null
          cover: string | null
          created_at: string
          cta: number | null
          display_name: string
          extension: string | null
          filesize: number | null
          id: string
          name: string
          object_fit: number | null
          public_src: string | null
          type: Database["public"]["Enums"]["media_type"] | null
          updated_at: string | null
        }
        Insert: {
          alt?: string | null
          autodetect_source?: boolean | null
          autoplay?: boolean | null
          controls?: number | null
          cover?: string | null
          created_at?: string
          cta?: number | null
          display_name: string
          extension?: string | null
          filesize?: number | null
          id: string
          name: string
          object_fit?: number | null
          public_src?: string | null
          type?: Database["public"]["Enums"]["media_type"] | null
          updated_at?: string | null
        }
        Update: {
          alt?: string | null
          autodetect_source?: boolean | null
          autoplay?: boolean | null
          controls?: number | null
          cover?: string | null
          created_at?: string
          cta?: number | null
          display_name?: string
          extension?: string | null
          filesize?: number | null
          id?: string
          name?: string
          object_fit?: number | null
          public_src?: string | null
          type?: Database["public"]["Enums"]["media_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medias_controls_fkey"
            columns: ["controls"]
            isOneToOne: false
            referencedRelation: "Medias_Controls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medias_cover_fkey"
            columns: ["cover"]
            isOneToOne: false
            referencedRelation: "Medias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medias_cta_fkey"
            columns: ["cta"]
            isOneToOne: false
            referencedRelation: "CTA_Link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medias_object_fit_fkey"
            columns: ["object_fit"]
            isOneToOne: false
            referencedRelation: "Media_Adjustement"
            referencedColumns: ["id"]
          },
        ]
      }
      Medias_Controls: {
        Row: {
          created_at: string | null
          duration: boolean | null
          hidden: boolean | null
          id: number
          name: string | null
          play: boolean | null
          progress: boolean | null
          updated_at: string | null
          volume: boolean | null
        }
        Insert: {
          created_at?: string | null
          duration?: boolean | null
          hidden?: boolean | null
          id?: number
          name?: string | null
          play?: boolean | null
          progress?: boolean | null
          updated_at?: string | null
          volume?: boolean | null
        }
        Update: {
          created_at?: string | null
          duration?: boolean | null
          hidden?: boolean | null
          id?: number
          name?: string | null
          play?: boolean | null
          progress?: boolean | null
          updated_at?: string | null
          volume?: boolean | null
        }
        Relationships: []
      }
      Node: {
        Row: {
          Album: number | null
          created_at: string
          height: number
          HeroSection: number | null
          id: string
          locked: boolean
          Platform_Link: number | null
          Single: number | null
          Text: number | null
          type: Database["public"]["Enums"]["brick_type"] | null
          width: number
          x: number
          y: number
        }
        Insert: {
          Album?: number | null
          created_at?: string
          height: number
          HeroSection?: number | null
          id?: string
          locked?: boolean
          Platform_Link?: number | null
          Single?: number | null
          Text?: number | null
          type?: Database["public"]["Enums"]["brick_type"] | null
          width: number
          x: number
          y: number
        }
        Update: {
          Album?: number | null
          created_at?: string
          height?: number
          HeroSection?: number | null
          id?: string
          locked?: boolean
          Platform_Link?: number | null
          Single?: number | null
          Text?: number | null
          type?: Database["public"]["Enums"]["brick_type"] | null
          width?: number
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "Node_Album_fkey"
            columns: ["Album"]
            isOneToOne: false
            referencedRelation: "Bricks_Album"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Node_HeroSection_fkey"
            columns: ["HeroSection"]
            isOneToOne: false
            referencedRelation: "Bricks_HeroSection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Node_Platform_Link_fkey"
            columns: ["Platform_Link"]
            isOneToOne: false
            referencedRelation: "Platform_Link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Node_Single_fkey"
            columns: ["Single"]
            isOneToOne: false
            referencedRelation: "Bricks_Single"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Node_Text_fkey"
            columns: ["Text"]
            isOneToOne: false
            referencedRelation: "Bricks_Text"
            referencedColumns: ["id"]
          },
        ]
      }
      Platform: {
        Row: {
          created_at: string
          icon: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      Platform_Link: {
        Row: {
          created_at: string
          id: number
          name: string
          platform: number | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          platform?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          platform?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Platform_Link_platform_fkey"
            columns: ["platform"]
            isOneToOne: false
            referencedRelation: "Platform"
            referencedColumns: ["id"]
          },
        ]
      }
      Track: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      Track_Artist: {
        Row: {
          artist: number
          tracklist: number
        }
        Insert: {
          artist: number
          tracklist: number
        }
        Update: {
          artist?: number
          tracklist?: number
        }
        Relationships: [
          {
            foreignKeyName: "Track_Artist_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "Artist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Track_Artist_tracklist_fkey"
            columns: ["tracklist"]
            isOneToOne: false
            referencedRelation: "Track"
            referencedColumns: ["id"]
          },
        ]
      }
      Track_Platform_Link: {
        Row: {
          platforms: number
          tracklist: number
        }
        Insert: {
          platforms: number
          tracklist: number
        }
        Update: {
          platforms?: number
          tracklist?: number
        }
        Relationships: [
          {
            foreignKeyName: "Track_Platform_Link_platforms_fkey"
            columns: ["platforms"]
            isOneToOne: false
            referencedRelation: "Platform_Link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Track_Platform_Link_tracklist_fkey"
            columns: ["tracklist"]
            isOneToOne: false
            referencedRelation: "Track"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          accepted: boolean
          id: string
          requested: boolean
          username: string | null
        }
        Insert: {
          accepted?: boolean
          id: string
          requested?: boolean
          username?: string | null
        }
        Update: {
          accepted?: boolean
          id?: string
          requested?: boolean
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Website_Settings: {
        Row: {
          api_amazon_music: string | null
          api_deezer: string | null
          api_soundcloud: string | null
          api_spotify: string | null
          api_tidal: string | null
          api_youtube_music: string | null
          created_at: string | null
          created_by: string | null
          email_administrator: number
          email_contact: number
          email_default_sender: string
          email_logging: number
          email_user_creator: number
          hidden: boolean | null
          id: number
          media_auto_optimize: boolean | null
          media_lazyload: boolean | null
          media_max_size_height: number | null
          media_max_size_mb: number | null
          misc_confidentiality: string | null
          modified_at: string | null
          style_color_auto: boolean | null
          style_color_main: string | null
          style_color_secondary: string | null
          style_font_main: string | null
          style_font_secondary: string | null
          style_theme_toggle: boolean | null
          website_icone: number | null
          website_keywords: string | null
          website_language: number
          website_title: string | null
          website_url: string
        }
        Insert: {
          api_amazon_music?: string | null
          api_deezer?: string | null
          api_soundcloud?: string | null
          api_spotify?: string | null
          api_tidal?: string | null
          api_youtube_music?: string | null
          created_at?: string | null
          created_by?: string | null
          email_administrator: number
          email_contact: number
          email_default_sender: string
          email_logging: number
          email_user_creator: number
          hidden?: boolean | null
          id?: number
          media_auto_optimize?: boolean | null
          media_lazyload?: boolean | null
          media_max_size_height?: number | null
          media_max_size_mb?: number | null
          misc_confidentiality?: string | null
          modified_at?: string | null
          style_color_auto?: boolean | null
          style_color_main?: string | null
          style_color_secondary?: string | null
          style_font_main?: string | null
          style_font_secondary?: string | null
          style_theme_toggle?: boolean | null
          website_icone?: number | null
          website_keywords?: string | null
          website_language: number
          website_title?: string | null
          website_url: string
        }
        Update: {
          api_amazon_music?: string | null
          api_deezer?: string | null
          api_soundcloud?: string | null
          api_spotify?: string | null
          api_tidal?: string | null
          api_youtube_music?: string | null
          created_at?: string | null
          created_by?: string | null
          email_administrator?: number
          email_contact?: number
          email_default_sender?: string
          email_logging?: number
          email_user_creator?: number
          hidden?: boolean | null
          id?: number
          media_auto_optimize?: boolean | null
          media_lazyload?: boolean | null
          media_max_size_height?: number | null
          media_max_size_mb?: number | null
          misc_confidentiality?: string | null
          modified_at?: string | null
          style_color_auto?: boolean | null
          style_color_main?: string | null
          style_color_secondary?: string | null
          style_font_main?: string | null
          style_font_secondary?: string | null
          style_theme_toggle?: boolean | null
          website_icone?: number | null
          website_keywords?: string | null
          website_language?: number
          website_title?: string | null
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Website_Settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Website_Settings_email_administrator_fkey"
            columns: ["email_administrator"]
            isOneToOne: false
            referencedRelation: "Mail_Pairing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Website_Settings_email_contact_fkey"
            columns: ["email_contact"]
            isOneToOne: false
            referencedRelation: "Mail_Pairing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Website_Settings_email_logging_fkey"
            columns: ["email_logging"]
            isOneToOne: false
            referencedRelation: "Mail_Pairing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Website_Settings_email_user_creator_fkey"
            columns: ["email_user_creator"]
            isOneToOne: false
            referencedRelation: "Mail_Pairing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Website_Settings_website_language_fkey"
            columns: ["website_language"]
            isOneToOne: false
            referencedRelation: "Available_Languages"
            referencedColumns: ["id"]
          },
        ]
      }
      Website_Settings_Main_APIs: {
        Row: {
          api_amazon_music: string | null
          api_deezer: string | null
          api_soundcloud: string | null
          api_spotify: string | null
          api_tidal: string | null
          api_youtube_music: string | null
          created_at: string | null
          id: number
          modified_at: string | null
        }
        Insert: {
          api_amazon_music?: string | null
          api_deezer?: string | null
          api_soundcloud?: string | null
          api_spotify?: string | null
          api_tidal?: string | null
          api_youtube_music?: string | null
          created_at?: string | null
          id?: number
          modified_at?: string | null
        }
        Update: {
          api_amazon_music?: string | null
          api_deezer?: string | null
          api_soundcloud?: string | null
          api_spotify?: string | null
          api_tidal?: string | null
          api_youtube_music?: string | null
          created_at?: string | null
          id?: number
          modified_at?: string | null
        }
        Relationships: []
      }
      Website_Settings_Main_Emails: {
        Row: {
          created_at: string | null
          email_administrator: number
          email_contact: number
          email_default_sender: string
          email_logging: number
          email_user_creator: number
          id: number
          modified_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_administrator: number
          email_contact: number
          email_default_sender: string
          email_logging: number
          email_user_creator: number
          id?: number
          modified_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_administrator?: number
          email_contact?: number
          email_default_sender?: string
          email_logging?: number
          email_user_creator?: number
          id?: number
          modified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_settings_email_administrator_fkey"
            columns: ["email_administrator"]
            isOneToOne: false
            referencedRelation: "Mail_Pairing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_settings_email_contact_fkey"
            columns: ["email_contact"]
            isOneToOne: false
            referencedRelation: "Mail_Pairing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_settings_email_logging_fkey"
            columns: ["email_logging"]
            isOneToOne: false
            referencedRelation: "Mail_Pairing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_settings_email_user_creator_fkey"
            columns: ["email_user_creator"]
            isOneToOne: false
            referencedRelation: "Mail_Pairing"
            referencedColumns: ["id"]
          },
        ]
      }
      Website_Settings_Main_Misc: {
        Row: {
          created_at: string | null
          id: number
          modified_at: string | null
          website_icon: number | null
          website_keywords: string | null
          website_language: number
          website_title: string | null
          website_url: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          modified_at?: string | null
          website_icon?: number | null
          website_keywords?: string | null
          website_language?: number
          website_title?: string | null
          website_url: string
        }
        Update: {
          created_at?: string | null
          id?: number
          modified_at?: string | null
          website_icon?: number | null
          website_keywords?: string | null
          website_language?: number
          website_title?: string | null
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Website_Settings_Main_Misc_website_language_fkey"
            columns: ["website_language"]
            isOneToOne: false
            referencedRelation: "Available_Languages"
            referencedColumns: ["id"]
          },
        ]
      }
      Website_Settings_Medias: {
        Row: {
          created_at: string | null
          id: number
          media_auto_optimize: boolean | null
          media_lazyload: boolean | null
          media_max_size_height: number | null
          media_max_size_mb: number | null
          modified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          media_auto_optimize?: boolean | null
          media_lazyload?: boolean | null
          media_max_size_height?: number | null
          media_max_size_mb?: number | null
          modified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          media_auto_optimize?: boolean | null
          media_lazyload?: boolean | null
          media_max_size_height?: number | null
          media_max_size_mb?: number | null
          modified_at?: string | null
        }
        Relationships: []
      }
      Website_Settings_Misc: {
        Row: {
          created_at: string | null
          id: number
          misc_confidentiality: string | null
          modified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          misc_confidentiality?: string | null
          modified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          misc_confidentiality?: string | null
          modified_at?: string | null
        }
        Relationships: []
      }
      Website_Settings_Styles: {
        Row: {
          created_at: string | null
          id: number
          modified_at: string | null
          style_color_auto: boolean | null
          style_color_main: string | null
          style_color_secondary: string | null
          style_font_main: string | null
          style_font_secondary: string | null
          style_theme_toggle: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          modified_at?: string | null
          style_color_auto?: boolean | null
          style_color_main?: string | null
          style_color_secondary?: string | null
          style_font_main?: string | null
          style_font_secondary?: string | null
          style_theme_toggle?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: number
          modified_at?: string | null
          style_color_auto?: boolean | null
          style_color_main?: string | null
          style_color_secondary?: string | null
          style_font_main?: string | null
          style_font_secondary?: string | null
          style_theme_toggle?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      brick_type: "HeroSection" | "Single" | "Album" | "Text" | "Platform_Link"
      media_type: "Audios" | "Videos" | "Images" | "Misc"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type TableNames = keyof PublicSchema["Tables"] 