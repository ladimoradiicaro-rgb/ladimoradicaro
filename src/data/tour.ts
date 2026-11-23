// The scroll walkthrough of the two homes. Photos live in /assets/tour/<file>-1280.webp and -1920.webp.
// Room "key" is also the hook for the Avallon title image in motion.css (.tour-caption h3[data-title=...]).
import type { Key } from "../i18n";
export interface TourRoom { key: Key }
export interface TourShot { file: string; room: number; alt: string }
export interface TourData {
  id: "green" | "blue";
  anchor: string;
  className: string;
  /** Photo-lengths of scroll reserved before the first photo for the intro (logo / chapter title). */
  lead: number;
  /** Scroll length of the track in viewport heights (CSS --frames). */
  frames: number;
  nameKey: Key;
  rooms: TourRoom[];
  shots: TourShot[];
}

export const tours =  [
  {
    "id": "green",
    "anchor": "foto-verde",
    "className": "tour--verde",
    "lead": 2,
    "frames": 20,
    "nameKey": "homes.green.name",
    "rooms": [
      {
        "key": "tour.v1.room"
      },
      {
        "key": "tour.v2.room"
      },
      {
        "key": "tour.v3.room"
      },
      {
        "key": "tour.v4.room"
      },
      {
        "key": "tour.v5.room"
      },
      {
        "key": "tour.v6.room"
      }
    ],
    "shots": [
      {
        "file": "verde-esterni-05",
        "room": 0,
        "alt": "Veranda coperta della Dimora Verde, foto 1 di 3"
      },
      {
        "file": "verde-esterni-04",
        "room": 0,
        "alt": "Veranda coperta della Dimora Verde, foto 2 di 3"
      },
      {
        "file": "verde-esterni-06",
        "room": 0,
        "alt": "Veranda coperta della Dimora Verde, foto 3 di 3"
      },
      {
        "file": "verde-soggiorno-cucina-01",
        "room": 1,
        "alt": "Soggiorno della Dimora Verde, foto 1 di 3"
      },
      {
        "file": "verde-soggiorno-cucina-02",
        "room": 1,
        "alt": "Soggiorno della Dimora Verde, foto 2 di 3"
      },
      {
        "file": "verde-camere-11",
        "room": 1,
        "alt": "Soggiorno della Dimora Verde, foto 3 di 3"
      },
      {
        "file": "verde-soggiorno-cucina-08",
        "room": 2,
        "alt": "Cucina e zona pranzo della Dimora Verde, foto 1 di 3"
      },
      {
        "file": "verde-soggiorno-cucina-07",
        "room": 2,
        "alt": "Cucina e zona pranzo della Dimora Verde, foto 2 di 3"
      },
      {
        "file": "verde-soggiorno-cucina-05",
        "room": 2,
        "alt": "Cucina e zona pranzo della Dimora Verde, foto 3 di 3"
      },
      {
        "file": "verde-soggiorno-cucina-13",
        "room": 3,
        "alt": "Camera matrimoniale della Dimora Verde, foto 1 di 3"
      },
      {
        "file": "verde-camere-07",
        "room": 3,
        "alt": "Camera matrimoniale della Dimora Verde, foto 2 di 3"
      },
      {
        "file": "verde-camere-09",
        "room": 3,
        "alt": "Camera matrimoniale della Dimora Verde, foto 3 di 3"
      },
      {
        "file": "verde-camere-04",
        "room": 4,
        "alt": "Seconda camera della Dimora Verde, foto 1 di 3"
      },
      {
        "file": "verde-camere-01",
        "room": 4,
        "alt": "Seconda camera della Dimora Verde, foto 2 di 3"
      },
      {
        "file": "verde-camere-02",
        "room": 4,
        "alt": "Seconda camera della Dimora Verde, foto 3 di 3"
      },
      {
        "file": "verde-bagni-01",
        "room": 5,
        "alt": "Bagni della Dimora Verde, foto 1 di 3"
      },
      {
        "file": "verde-bagni-03",
        "room": 5,
        "alt": "Bagni della Dimora Verde, foto 2 di 3"
      },
      {
        "file": "verde-bagni-04",
        "room": 5,
        "alt": "Bagni della Dimora Verde, foto 3 di 3"
      }
    ]
  },
  {
    "id": "blue",
    "anchor": "foto-blu",
    "className": "tour--blu",
    "lead": 1,
    "frames": 16,
    "nameKey": "homes.blue.name",
    "rooms": [
      {
        "key": "tour.b1.room"
      },
      {
        "key": "tour.b2.room"
      },
      {
        "key": "tour.b3.room"
      },
      {
        "key": "tour.b4.room"
      },
      {
        "key": "tour.b5.room"
      }
    ],
    "shots": [
      {
        "file": "blu-esterni-01",
        "room": 0,
        "alt": "Ingresso e terrazzino della Dimora Blu, foto 1 di 3"
      },
      {
        "file": "blu-esterni-03",
        "room": 0,
        "alt": "Ingresso e terrazzino della Dimora Blu, foto 2 di 3"
      },
      {
        "file": "blu-esterni-02",
        "room": 0,
        "alt": "Ingresso e terrazzino della Dimora Blu, foto 3 di 3"
      },
      {
        "file": "blu-soggiorno-cucina-04",
        "room": 1,
        "alt": "Soggiorno della Dimora Blu, foto 1 di 3"
      },
      {
        "file": "blu-soggiorno-cucina-02",
        "room": 1,
        "alt": "Soggiorno della Dimora Blu, foto 2 di 3"
      },
      {
        "file": "blu-soggiorno-cucina-11",
        "room": 1,
        "alt": "Soggiorno della Dimora Blu, foto 3 di 3"
      },
      {
        "file": "blu-soggiorno-cucina-01",
        "room": 2,
        "alt": "Cucina della Dimora Blu, foto 1 di 3"
      },
      {
        "file": "blu-soggiorno-cucina-08",
        "room": 2,
        "alt": "Cucina della Dimora Blu, foto 2 di 3"
      },
      {
        "file": "blu-soggiorno-cucina-09",
        "room": 2,
        "alt": "Cucina della Dimora Blu, foto 3 di 3"
      },
      {
        "file": "blu-camere-04",
        "room": 3,
        "alt": "Camera matrimoniale della Dimora Blu, foto 1 di 3"
      },
      {
        "file": "blu-camere-01",
        "room": 3,
        "alt": "Camera matrimoniale della Dimora Blu, foto 2 di 3"
      },
      {
        "file": "blu-camere-07",
        "room": 3,
        "alt": "Camera matrimoniale della Dimora Blu, foto 3 di 3"
      },
      {
        "file": "blu-bagni-01",
        "room": 4,
        "alt": "Bagno della Dimora Blu, foto 1 di 3"
      },
      {
        "file": "blu-bagni-02",
        "room": 4,
        "alt": "Bagno della Dimora Blu, foto 2 di 3"
      },
      {
        "file": "blu-bagni-03",
        "room": 4,
        "alt": "Bagno della Dimora Blu, foto 3 di 3"
      }
    ]
  }
] satisfies TourData[];
