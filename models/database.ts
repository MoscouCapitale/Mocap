export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Artist: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          modified_at: string | null
          name: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id: number
          modified_at?: string | null
          name: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Artist_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      Artist_Track: {
        Row: {
          Artist_id: number
          Track_artist: number
        }
        Insert: {
          Artist_id: number
          Track_artist: number
        }
        Update: {
          Artist_id?: number
          Track_artist?: number
        }
        Relationships: [
          {
            foreignKeyName: "Artist_Track_Artist_id_fkey"
            columns: ["Artist_id"]
            isOneToOne: false
            referencedRelation: "Artist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Artist_Track_Track_artist_fkey"
            columns: ["Track_artist"]
            isOneToOne: false
            referencedRelation: "Track"
            referencedColumns: ["artist"]
          }
        ]
      }
      Audio: {
        Row: {
          autodetect_source: boolean | null
          controls: number | null
          created_at: string | null
          created_by: string | null
          cta: number | null
          hidden: boolean | null
          id: number
          media_cover: number
          modified_at: string | null
          name: string | null
          type: number
          url: string | null
        }
        Insert: {
          autodetect_source?: boolean | null
          controls?: number | null
          created_at?: string | null
          created_by?: string | null
          cta?: number | null
          hidden?: boolean | null
          id?: number
          media_cover: number
          modified_at?: string | null
          name?: string | null
          type: number
          url?: string | null
        }
        Update: {
          autodetect_source?: boolean | null
          controls?: number | null
          created_at?: string | null
          created_by?: string | null
          cta?: number | null
          hidden?: boolean | null
          id?: number
          media_cover?: number
          modified_at?: string | null
          name?: string | null
          type?: number
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Audio_controls_fkey"
            columns: ["controls"]
            isOneToOne: false
            referencedRelation: "Audio_Controls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Audio_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Audio_cta_fkey"
            columns: ["cta"]
            isOneToOne: false
            referencedRelation: "Audio_Link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Audio_media_cover_fkey"
            columns: ["media_cover"]
            isOneToOne: false
            referencedRelation: "Image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Audio_media_cover_fkey1"
            columns: ["media_cover"]
            isOneToOne: false
            referencedRelation: "Video"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Audio_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "Audio_Type"
            referencedColumns: ["id"]
          }
        ]
      }
      Audio_Controls: {
        Row: {
          created_at: string | null
          created_by: string | null
          duration: boolean | null
          hidden: boolean | null
          id: number
          modified_at: string | null
          play: boolean | null
          progress: boolean | null
          volume: boolean | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          duration?: boolean | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          play?: boolean | null
          progress?: boolean | null
          volume?: boolean | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          duration?: boolean | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          play?: boolean | null
          progress?: boolean | null
          volume?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "Audio_Controls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      Audio_Link: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          label: string
          modified_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          label: string
          modified_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          label?: string
          modified_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Audio_Link_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      Audio_Type: {
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
      Brick_Album: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          link: number | null
          media: number
          modified_at: string | null
          name: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          link?: number | null
          media: number
          modified_at?: string | null
          name?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          link?: number | null
          media?: number
          modified_at?: string | null
          name?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Brick_Album_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Album_link_fkey"
            columns: ["link"]
            isOneToOne: true
            referencedRelation: "Tracklist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Album_media_fkey"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Album_media_fkey1"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Video"
            referencedColumns: ["id"]
          }
        ]
      }
      Brick_Album_Brick_Tile: {
        Row: {
          Brick_Album_id: number
          Brick_Tile_bricks: number
        }
        Insert: {
          Brick_Album_id: number
          Brick_Tile_bricks: number
        }
        Update: {
          Brick_Album_id?: number
          Brick_Tile_bricks?: number
        }
        Relationships: [
          {
            foreignKeyName: "Brick_Album_Brick_Tile_Brick_Album_id_fkey"
            columns: ["Brick_Album_id"]
            isOneToOne: false
            referencedRelation: "Brick_Album"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Album_Brick_Tile_Brick_Tile_bricks_fkey"
            columns: ["Brick_Tile_bricks"]
            isOneToOne: false
            referencedRelation: "Brick_Tile"
            referencedColumns: ["bricks"]
          }
        ]
      }
      Brick_Main: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          media: number
          modified_at: string | null
          name: string | null
          text: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          media: number
          modified_at?: string | null
          name?: string | null
          text?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          media?: number
          modified_at?: string | null
          name?: string | null
          text?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Brick_Main_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Main_media_fkey"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Main_media_fkey1"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Video"
            referencedColumns: ["id"]
          }
        ]
      }
      Brick_Single: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          link: number | null
          media: number
          modified_at: string | null
          name: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          link?: number | null
          media: number
          modified_at?: string | null
          name?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          link?: number | null
          media?: number
          modified_at?: string | null
          name?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Brick_Single_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Single_media_fkey"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Single_media_fkey1"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "Video"
            referencedColumns: ["id"]
          }
        ]
      }
      Brick_Single_Brick_Tile: {
        Row: {
          Brick_Single_id: number
          Brick_Tile_bricks: number
        }
        Insert: {
          Brick_Single_id: number
          Brick_Tile_bricks: number
        }
        Update: {
          Brick_Single_id?: number
          Brick_Tile_bricks?: number
        }
        Relationships: [
          {
            foreignKeyName: "Brick_Single_Brick_Tile_Brick_Single_id_fkey"
            columns: ["Brick_Single_id"]
            isOneToOne: false
            referencedRelation: "Brick_Single"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Single_Brick_Tile_Brick_Tile_bricks_fkey"
            columns: ["Brick_Tile_bricks"]
            isOneToOne: false
            referencedRelation: "Brick_Tile"
            referencedColumns: ["bricks"]
          }
        ]
      }
      Brick_Socials: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          modified_at: string | null
          name: string | null
          plateform: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
          plateform?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
          plateform?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Brick_Socials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      Brick_Socials_Brick_Tile: {
        Row: {
          Brick_Socials_id: number
          Brick_Tile_bricks: number
        }
        Insert: {
          Brick_Socials_id: number
          Brick_Tile_bricks: number
        }
        Update: {
          Brick_Socials_id?: number
          Brick_Tile_bricks?: number
        }
        Relationships: [
          {
            foreignKeyName: "Brick_Socials_Brick_Tile_Brick_Socials_id_fkey"
            columns: ["Brick_Socials_id"]
            isOneToOne: false
            referencedRelation: "Brick_Socials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Socials_Brick_Tile_Brick_Tile_bricks_fkey"
            columns: ["Brick_Tile_bricks"]
            isOneToOne: false
            referencedRelation: "Brick_Tile"
            referencedColumns: ["bricks"]
          }
        ]
      }
      Brick_Text: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          modified_at: string | null
          name: string | null
          text: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
          text?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Brick_Text_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      Brick_Text_Brick_Tile: {
        Row: {
          Brick_Text_id: number
          Brick_Tile_bricks: number
        }
        Insert: {
          Brick_Text_id: number
          Brick_Tile_bricks: number
        }
        Update: {
          Brick_Text_id?: number
          Brick_Tile_bricks?: number
        }
        Relationships: [
          {
            foreignKeyName: "Brick_Text_Brick_Tile_Brick_Text_id_fkey"
            columns: ["Brick_Text_id"]
            isOneToOne: false
            referencedRelation: "Brick_Text"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brick_Text_Brick_Tile_Brick_Tile_bricks_fkey"
            columns: ["Brick_Tile_bricks"]
            isOneToOne: false
            referencedRelation: "Brick_Tile"
            referencedColumns: ["bricks"]
          }
        ]
      }
      Brick_Tile: {
        Row: {
          bricks: number | null
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          modified_at: string | null
          name: string | null
        }
        Insert: {
          bricks?: number | null
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
        }
        Update: {
          bricks?: number | null
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Brick_Tile_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      Brickable: {
        Row: {
          content: number
          id: number
        }
        Insert: {
          content: number
          id?: number
        }
        Update: {
          content?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Brickable_content_fkey"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "Brick_Main"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brickable_content_fkey1"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "Brick_Single"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brickable_content_fkey2"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "Brick_Album"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brickable_content_fkey3"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "Brick_Tile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brickable_content_fkey4"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "Brick_Text"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brickable_content_fkey5"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "Brick_Socials"
            referencedColumns: ["id"]
          }
        ]
      }
      Content: {
        Row: {
          content: number | null
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          modified_at: string | null
          name: string | null
        }
        Insert: {
          content?: number | null
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
        }
        Update: {
          content?: number | null
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Content_content_fkey"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "Brickable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Content_content_fkey1"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "Media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Content_content_fkey2"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "Plateform"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      Content_Users: {
        Row: {
          Content_id: number
          Users_content_created: number
        }
        Insert: {
          Content_id: number
          Users_content_created: number
        }
        Update: {
          Content_id?: number
          Users_content_created?: number
        }
        Relationships: [
          {
            foreignKeyName: "Content_Users_Content_id_fkey"
            columns: ["Content_id"]
            isOneToOne: false
            referencedRelation: "Content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Content_Users_Users_content_created_fkey"
            columns: ["Users_content_created"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["content_created"]
          }
        ]
      }
      Image: {
        Row: {
          adjustement: number
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          modified_at: string | null
          name: string | null
          url: string | null
        }
        Insert: {
          adjustement: number
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
          url?: string | null
        }
        Update: {
          adjustement?: number
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Image_adjustement_fkey"
            columns: ["adjustement"]
            isOneToOne: false
            referencedRelation: "Media_Adjustement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Image_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
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
      Media: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          media_type: number
          modified_at: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          media_type: number
          modified_at?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          media_type?: number
          modified_at?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Media_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Media_media_type_fkey"
            columns: ["media_type"]
            isOneToOne: false
            referencedRelation: "Image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Media_media_type_fkey1"
            columns: ["media_type"]
            isOneToOne: false
            referencedRelation: "Video"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Media_media_type_fkey2"
            columns: ["media_type"]
            isOneToOne: false
            referencedRelation: "Audio"
            referencedColumns: ["id"]
          }
        ]
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
      Media_Brick_Tile: {
        Row: {
          Brick_Tile_bricks: number
          Media_id: number
        }
        Insert: {
          Brick_Tile_bricks: number
          Media_id: number
        }
        Update: {
          Brick_Tile_bricks?: number
          Media_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Media_Brick_Tile_Brick_Tile_bricks_fkey"
            columns: ["Brick_Tile_bricks"]
            isOneToOne: false
            referencedRelation: "Brick_Tile"
            referencedColumns: ["bricks"]
          },
          {
            foreignKeyName: "Media_Brick_Tile_Media_id_fkey"
            columns: ["Media_id"]
            isOneToOne: false
            referencedRelation: "Media"
            referencedColumns: ["id"]
          }
        ]
      }
      Plateform: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          image: number
          modified_at: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          image: number
          modified_at?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          image?: number
          modified_at?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Plateform_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Plateform_image_fkey"
            columns: ["image"]
            isOneToOne: false
            referencedRelation: "Image"
            referencedColumns: ["id"]
          }
        ]
      }
      Plateform_Link: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          modified_at: string | null
          plateform: number | null
          url: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          plateform?: number | null
          url: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          plateform?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Plateform_Link_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Plateform_Link_plateform_fkey"
            columns: ["plateform"]
            isOneToOne: false
            referencedRelation: "Plateform"
            referencedColumns: ["id"]
          }
        ]
      }
      Plateform_Link_Brick_Album: {
        Row: {
          Brick_Album_link: number
          Plateform_Link_id: number
        }
        Insert: {
          Brick_Album_link: number
          Plateform_Link_id: number
        }
        Update: {
          Brick_Album_link?: number
          Plateform_Link_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Plateform_Link_Brick_Album_Brick_Album_link_fkey"
            columns: ["Brick_Album_link"]
            isOneToOne: false
            referencedRelation: "Brick_Album"
            referencedColumns: ["link"]
          },
          {
            foreignKeyName: "Plateform_Link_Brick_Album_Plateform_Link_id_fkey"
            columns: ["Plateform_Link_id"]
            isOneToOne: false
            referencedRelation: "Plateform_Link"
            referencedColumns: ["id"]
          }
        ]
      }
      Plateform_Link_Brick_Single: {
        Row: {
          Brick_Single_link: number
          Plateform_Link_id: number
        }
        Insert: {
          Brick_Single_link: number
          Plateform_Link_id: number
        }
        Update: {
          Brick_Single_link?: number
          Plateform_Link_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Plateform_Link_Brick_Single_Brick_Single_link_fkey"
            columns: ["Brick_Single_link"]
            isOneToOne: false
            referencedRelation: "Brick_Single"
            referencedColumns: ["link"]
          },
          {
            foreignKeyName: "Plateform_Link_Brick_Single_Plateform_Link_id_fkey"
            columns: ["Plateform_Link_id"]
            isOneToOne: false
            referencedRelation: "Plateform_Link"
            referencedColumns: ["id"]
          }
        ]
      }
      Plateform_Link_Brick_Socials: {
        Row: {
          Brick_Socials_plateform: number
          Plateform_Link_id: number
        }
        Insert: {
          Brick_Socials_plateform: number
          Plateform_Link_id: number
        }
        Update: {
          Brick_Socials_plateform?: number
          Plateform_Link_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Plateform_Link_Brick_Socials_Brick_Socials_plateform_fkey"
            columns: ["Brick_Socials_plateform"]
            isOneToOne: false
            referencedRelation: "Brick_Socials"
            referencedColumns: ["plateform"]
          },
          {
            foreignKeyName: "Plateform_Link_Brick_Socials_Plateform_Link_id_fkey"
            columns: ["Plateform_Link_id"]
            isOneToOne: false
            referencedRelation: "Plateform_Link"
            referencedColumns: ["id"]
          }
        ]
      }
      Plateform_Link_Track: {
        Row: {
          Plateform_Link_id: number
          Track_link: number
        }
        Insert: {
          Plateform_Link_id: number
          Track_link: number
        }
        Update: {
          Plateform_Link_id?: number
          Track_link?: number
        }
        Relationships: [
          {
            foreignKeyName: "Plateform_Link_Track_Plateform_Link_id_fkey"
            columns: ["Plateform_Link_id"]
            isOneToOne: false
            referencedRelation: "Plateform_Link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Plateform_Link_Track_Track_link_fkey"
            columns: ["Track_link"]
            isOneToOne: false
            referencedRelation: "Track"
            referencedColumns: ["link"]
          }
        ]
      }
      Track: {
        Row: {
          artist: number | null
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          link: number | null
          modified_at: string | null
          name: string
        }
        Insert: {
          artist?: number | null
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          link?: number | null
          modified_at?: string | null
          name: string
        }
        Update: {
          artist?: number | null
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          link?: number | null
          modified_at?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "Track_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      Track_Tracklist: {
        Row: {
          Track_id: number
          Tracklist_track: number
        }
        Insert: {
          Track_id: number
          Tracklist_track: number
        }
        Update: {
          Track_id?: number
          Tracklist_track?: number
        }
        Relationships: [
          {
            foreignKeyName: "Track_Tracklist_Track_id_fkey"
            columns: ["Track_id"]
            isOneToOne: false
            referencedRelation: "Track"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Track_Tracklist_Tracklist_track_fkey"
            columns: ["Tracklist_track"]
            isOneToOne: false
            referencedRelation: "Tracklist"
            referencedColumns: ["track"]
          }
        ]
      }
      Tracklist: {
        Row: {
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          modified_at: string | null
          track: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          track?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          track?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Tracklist_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      Users: {
        Row: {
          accepted: boolean
          content_created: number | null
          id: string
          requested: boolean
          username: string | null
        }
        Insert: {
          accepted?: boolean
          content_created?: number | null
          id: string
          requested?: boolean
          username?: string | null
        }
        Update: {
          accepted?: boolean
          content_created?: number | null
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
          }
        ]
      }
      Video: {
        Row: {
          adjustement: number
          autoplay: boolean | null
          created_at: string | null
          created_by: string | null
          hidden: boolean | null
          id: number
          modified_at: string | null
          name: string | null
          url: string | null
        }
        Insert: {
          adjustement: number
          autoplay?: boolean | null
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
          url?: string | null
        }
        Update: {
          adjustement?: number
          autoplay?: boolean | null
          created_at?: string | null
          created_by?: string | null
          hidden?: boolean | null
          id?: number
          modified_at?: string | null
          name?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Video_adjustement_fkey"
            columns: ["adjustement"]
            isOneToOne: false
            referencedRelation: "Media_Adjustement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Video_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
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
            foreignKeyName: "Website_Settings_website_icone_fkey"
            columns: ["website_icone"]
            isOneToOne: false
            referencedRelation: "Media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Website_Settings_website_language_fkey"
            columns: ["website_language"]
            isOneToOne: false
            referencedRelation: "Available_Languages"
            referencedColumns: ["id"]
          }
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
          }
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
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
