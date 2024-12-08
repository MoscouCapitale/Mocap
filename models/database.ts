export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
      Bricks_Audio: {
        Row: {
          audio: string | null
          created_at: string
          id: number
          media: string | null
          name: string
          track: number | null
          updated_at: string | null
        }
        Insert: {
          audio?: string | null
          created_at?: string
          id?: number
          media?: string | null
          name: string
          track?: number | null
          updated_at?: string | null
        }
        Update: {
          audio?: string | null
          created_at?: string
          id?: number
          media?: string | null
          name?: string
          track?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Bricks_Audio_audio_fkey"
            columns: ["audio"]
            isOneToOne: false
            referencedRelation: "Medias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bricks_Audio_media_fkey"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Medias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bricks_Audio_track_fkey"
            columns: ["track"]
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
          style: Database["public"]["Enums"]["herosection_style"]
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
          style?: Database["public"]["Enums"]["herosection_style"]
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
          style?: Database["public"]["Enums"]["herosection_style"]
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
      Bricks_Highlight: {
        Row: {
          created_at: string
          id: number
          link: string | null
          media: string | null
          name: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          link?: string | null
          media?: string | null
          name: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          link?: string | null
          media?: string | null
          name?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Bricks_Highlight_media_fkey1"
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
          media: string | null
          name: string
          text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          media?: string | null
          name: string
          text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          media?: string | null
          name?: string
          text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Bricks_Text_media_fkey"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Medias"
            referencedColumns: ["id"]
          },
        ]
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
          object_fit: Database["public"]["Enums"]["media_fit"] | null
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
          object_fit?: Database["public"]["Enums"]["media_fit"] | null
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
          object_fit?: Database["public"]["Enums"]["media_fit"] | null
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
          Audio: number | null
          created_at: string
          height: number
          HeroSection: number | null
          Highlight: number | null
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
          Audio?: number | null
          created_at?: string
          height: number
          HeroSection?: number | null
          Highlight?: number | null
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
          Audio?: number | null
          created_at?: string
          height?: number
          HeroSection?: number | null
          Highlight?: number | null
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
            foreignKeyName: "Node_Audio_fkey"
            columns: ["Audio"]
            isOneToOne: false
            referencedRelation: "Bricks_Audio"
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
            foreignKeyName: "Node_Highlight_fkey"
            columns: ["Highlight"]
            isOneToOne: false
            referencedRelation: "Bricks_Highlight"
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
          in_footer: boolean
          name: string
          platform: number | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          in_footer?: boolean
          name: string
          platform?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          in_footer?: boolean
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
      Settings: {
        Row: {
          created_at: string
          id: number
          main: Json | null
          medias: Json | null
          misc: Json | null
          styles: Json | null
          updated_at: string | null
          user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          main?: Json | null
          medias?: Json | null
          misc?: Json | null
          styles?: Json | null
          updated_at?: string | null
          user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          main?: Json | null
          medias?: Json | null
          misc?: Json | null
          styles?: Json | null
          updated_at?: string | null
          user?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_id_by_email: {
        Args: {
          email: string
        }
        Returns: {
          id: string
        }[]
      }
    }
    Enums: {
      brick_type:
        | "HeroSection"
        | "Single"
        | "Album"
        | "Text"
        | "Platform_Link"
        | "Highlight"
        | "Audio"
      herosection_style: "scrolling-hero"
      media_fit: "best" | "cover" | "contain"
      media_type: "Audios" | "Videos" | "Images" | "Misc"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export type TableNames = keyof PublicSchema["Tables"] | keyof PublicSchema["Views"]