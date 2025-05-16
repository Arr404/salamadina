/*
import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/init';

// Organize images by their folder categories
const organizeImagesByFolder = (imagePaths: string[]) => {
  const folderMap: Record<string, string[]> = {};

  imagePaths.forEach(path => {
    // Extract folder name from path (e.g., "images/gallery/3 Februari/image.jpg" -> "3 Februari")
    const match = path.match(/images\/gallery\/([^\/]+)/);
    if (match && match[1]) {
      const folder = match[1];
      if (!folderMap[folder]) {
        folderMap[folder] = [];
      }
      folderMap[folder].push(path);
    }
  });

  return folderMap;
};

// Create gallery data objects from organized images
// Helper ─ give every string its first letter in upper‑case for nicer tags
const toTitle = (str: string) =>
  str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;

// Try to detect a 4‑digit year from any file name in the folder
const detectYear = (paths: string[]) => {
  for (const p of paths) {
    const m = p.match(/(\d{4})/);
    if (m) return m[1];
  }
  return undefined;
};
const MONTHS = [
  'januari','februari','maret','april','mei','juni',
  'juli','agustus','september','oktober','november','desember',
];


/!* ────────── factory ────────── *!/
const createGalleryData = (folderMap: Record<string, string[]>) => {
  const galleryData: any[] = [];

  for (const [folder, images] of Object.entries(folderMap)) {
    const lower = folder.toLowerCase();
    const category = lower.includes('umroh')
      ? 'Umroh'
      : lower.includes('haji')
        ? 'Haji'
        : 'Trip';

    /!* ---------- LOGIKA TAG ---------- *!/
    const tokens = folder.split(/[\s_-]+/).filter(Boolean);

    let dayMonthTag: string | undefined;
    let monthTag: string | undefined;
    let startIdx = 0;

    // pola: <1‑2 digit> <nama bulan>
    if (
      tokens.length >= 2 &&
      /^\d{1,2}$/.test(tokens[0]) &&
      MONTHS.includes(tokens[1].toLowerCase())
    ) {
      dayMonthTag = `${tokens[0]} ${toTitle(tokens[1])}`; // "5 Oktober"
      monthTag = toTitle(tokens[1]);                      // "Oktober"
      startIdx = 2;
    } else {
      // Jika folder tidak diawali hari‑bulan tapi mengandung bulan, ambil bulan pertama
      const mIdx = tokens.findIndex(t => MONTHS.includes(t.toLowerCase()));
      if (mIdx !== -1) monthTag = toTitle(tokens[mIdx]);
    }

    // Token lain: buang angka & nama bulan
    const baseTokens = tokens
      .slice(startIdx)
      .filter(
        t => !/^\d+$/.test(t) && !MONTHS.includes(t.toLowerCase())
      );

    const year = detectYear(images); // ex. "2024"

    const rawTags = [
      ...(dayMonthTag ? [dayMonthTag] : []),
      ...(monthTag ? [monthTag] : []),
      ...baseTokens,
      ...(year ? [year] : []),
      category.toLowerCase(),
    ];

    const tags = Array.from(new Set(rawTags.map(toTitle)));
    /!* --------------------------------- *!/

    galleryData.push({
      title: toTitle(folder),
      description: `Collection of images from ${toTitle(folder)}`,
      category,
      tags,                           // ← tag final
      imageSrc: images[0],
      color: `hsl(${Math.floor(Math.random() * 360)},70%,75%)`,
      group:
        category === 'Umroh'
          ? 'Umroh'
          : category === 'Haji'
            ? 'Haji'
            : 'Regular Trip',
      groupPhotos: images.slice(1).map(img => ({
        caption: `Photo from ${toTitle(folder)}`,
        imageSrc: img,
        color: `hsl(${Math.floor(Math.random() * 360)},70%,75%)`,
      })),
    });
  }

  return galleryData;
};



// List of image paths
const images = [
  "images/gallery/3 Februari/IMG-20250205-WA0051.jpg",
  "images/gallery/3 Februari/IMG-20250205-WA0068.jpg",
  "images/gallery/3 Februari/IMG-20250205-WA0074.jpg",
  "images/gallery/3 Februari/IMG-20250205-WA0093.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0018.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0019.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0079.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0083.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0092.jpg",
  "images/gallery/3 Februari/IMG-20250206-WA0143.jpg",
  "images/gallery/3 Februari/IMG-20250208-WA0095.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0007.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0020.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0039.jpg",
  "images/gallery/3 Februari/IMG-20250209-WA0051.jpg",
  "images/gallery/3 Februari/IMG-20250211-WA0004.jpg",
  "images/gallery/3 Februari/WhatsApp Image 2025-02-09 at 07.57.10_7f459ee6.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241009-WA0026.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241009-WA0054.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241010-WA0014.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241014-WA0051.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241015-WA0005.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241108-WA0032.jpg",
  "images/gallery/5 oktober 24 umroh corporate/IMG-20241108-WA0035.jpg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2023-05-11 at 19.58.22.jpeg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2024-11-07 at 15.05.51_998b0c75.jpg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2024-11-07 at 15.14.43_b685204a.jpg",
  "images/gallery/5 oktober 24 umroh corporate/WhatsApp Image 2024-11-07 at 15.21.18_1c49e39e.jpg",
  "images/gallery/19 Desember/IMG-20241222-WA0043.jpg",
  "images/gallery/19 Desember/IMG-20241223-WA0034.jpg",
  "images/gallery/19 Desember/IMG-20241223-WA0035.jpg",
  "images/gallery/19 Desember/IMG-20241224-WA0050.jpg",
  "images/gallery/19 Desember/IMG-20241224-WA0055.jpg",
  "images/gallery/19 Desember/IMG-20241227-WA0034.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0043.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0045.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0047.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0054.jpg",
  "images/gallery/19 Desember/IMG-20241228-WA0055.jpg",
  "images/gallery/19 Desember/WhatsApp Image 2024-12-23 at 19.20.39_2e0a8a1a.jpg",
  "images/gallery/19 Desember/WhatsApp Image 2024-12-23 at 19.20.40_fc46fd99.jpg",
  "images/gallery/19 Desember/WhatsApp Image 2024-12-28 at 17.24.58_8781c8a3.jpg",
  "images/gallery/22 Januari/IMG-20250129-WA0107.jpg",
  "images/gallery/22 Januari/IMG-20250201-WA0080.jpg",
  "images/gallery/22 Januari/IMG-20250202-WA0001.jpg",
  "images/gallery/28 Januari/IMG-20250201-WA0057.jpg",
  "images/gallery/28 Januari/IMG-20250204-WA0059.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-02 at 20.34.36_0244155c.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.35_166533e2.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.38_d1d9c67d.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.39_82bc6ee4.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-03 at 09.20.40_f13273f8.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-07 at 13.02.58_dd12cd61.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-07 at 13.14.36_614600d9.jpg",
  "images/gallery/28 Januari/WhatsApp Image 2025-02-07 at 13.16.32_447f54cc.jpg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-25 at 00.00.13.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-28 at 14.55.46.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-28 at 14.55.49.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-06-28 at 14.56.16.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-07-05 at 12.59.03.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-07-10 at 23.54.52 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2023-07-11 at 21.05.27.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.20 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.20 (2).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.20 (3).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.21.jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.21 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.21 (2).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.22 (1).jpeg",
  "images/gallery/Haji 2023/WhatsApp Image 2024-09-29 at 05.49.23.jpeg"
];

export async function POST(request: Request) {
  try {
    // Organize images by folder
    const folderMap = organizeImagesByFolder(images);

    // Create gallery data objects
    const galleryDatas = createGalleryData(folderMap);

    // Create main photo entries and collect their IDs
    const mainPhotoResults = await Promise.all(
      galleryDatas.map(async (galleryData) => {
        const { groupPhotos, imageSrc, ...mainPhotoData } = galleryData;

        // Create main photo document
        const mainPhotoRef = await addDoc(collection(db, 'photos'), {
          ...mainPhotoData,
          // No imageSrc in the Photo type, using the first group photo instead
          dateAdded: serverTimestamp(),
          createdBy: 'seeder',
          groupPhotoIds: [] // Initially empty array
        });

        // Create group photos linked to this main photo
        const groupPhotoPromises = [
          // Add the first image as a group photo too
          {
            caption: `Main photo from ${mainPhotoData.title}`,
            imageSrc: imageSrc,
            color: mainPhotoData.color
          },
          ...groupPhotos
        ].map(async (groupPhoto: any) => {
          const groupPhotoRef = await addDoc(collection(db, 'groupPhotos'), {
            ...groupPhoto,
            photoId: mainPhotoRef.id,
            createdAt: serverTimestamp()
          });

          return groupPhotoRef.id;
        });

        // Get all group photo IDs
        const groupPhotoIds = await Promise.all(groupPhotoPromises);

        // Update main photo with group photo IDs
        await updateDoc(doc(db, 'photos', mainPhotoRef.id), {
          groupPhotoIds
        });

        return {
          id: mainPhotoRef.id,
          title: mainPhotoData.title,
          groupPhotoCount: groupPhotoIds.length
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Gallery data seeded successfully',
      count: mainPhotoResults.length,
      data: mainPhotoResults
    });
  } catch (error) {
    console.error('Error seeding gallery data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed gallery data' },
      { status: 500 }
    );
  }
}
*/
