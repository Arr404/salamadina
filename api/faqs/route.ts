/*
// src/app/api/testimonials/route.ts
import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/init';

// Your testimonial data
const faqs = [
  {
    id: "faq1",
    categories: ["umrah", "requirements"],
    translations: {
      en: {
        question: "What documents are required for Umrah?",
        answer:
          "Required documents for Umrah include:\n" +
          "• Original Passport (with at least 2 names and valid for 12 months from the departure date).\n" +
          "• A4 sized photocopy/scan of your ID card (KTP).\n" +
          "• Photocopy/scan of your Family Card (KK).\n" +
          "• Photocopy/scan of your Marriage Book (for couples).\n" +
          "• Three 4×6 passport photos (white background, 80% face focus; write full name on the back as per passport).\n" +
          "• Yellow Vaccination Book for Meningitis (valid until return date).\n" +
          "• Photocopy/scan of Birth Certificate (for children aged ≤ 17 years)."
      },
      ind: {
        question: "Dokumen apa saja yang menjadi persyaratan umrah?",
        answer:
          "Dokumen persyaratan untuk Umroh antara lain:\n" +
          "• Paspor Asli (minimal nama 2 suku kata dan masa berlaku 12 bulan dari tanggal keberangkatan).\n" +
          "• Fotokopi/scan KTP berukuran A4.\n" +
          "• Fotokopi/scan KK.\n" +
          "• Fotokopi/scan Buku Nikah (bagi pasangan suami istri).\n" +
          "• Pas Foto ukuran 4×6 sebanyak 3 lembar (background putih, fokus wajah 80%, tulis nama lengkap di belakang).\n" +
          "• Buku Kuning Suntik Meningitis (berlaku hingga tanggal kepulangan).\n" +
          "• Fotokopi/scan Akta Kelahiran (khusus anak ≤ 17 tahun)."
      }
    }
  },
  {
    id: "faq2",
    categories: ["umrah", "requirements"],
    translations: {
      en: {
        question: "When should the Umrah documents be submitted?",
        answer: "Documents must be submitted no later than 1 month before the departure date."
      },
      ind: {
        question: "Kapan dokumen persyaratan umrah diserahkan?",
        answer: "Paling lambat 1 bulan sebelum tanggal keberangkatan."
      }
    }
  },
  {
    id: "faq3",
    categories: ["umrah", "requirements"],
    translations: {
      en: {
        question: "How can I send my documents if I am outside of Jombang?",
        answer:
          "Documents can be sent via an insured courier service to the Salamadina Tour address. " +
          "Please include the sender’s name and the departure date."
      },
      ind: {
        question: "Apabila saya berada di luar Jombang, bagaimana cara pengiriman dokumennya?",
        answer:
          "Dokumen bisa dikirimkan dengan jasa ekspedisi berasuransi ke alamat Salamadina Tour; " +
          "harap cantumkan nama pengirim dan tanggal keberangkatan."
      }
    }
  },
  {
    id: "faq4",
    categories: ["umrah", "requirements"],
    translations: {
      en: {
        question: "Who will process the visa and when?",
        answer:
          "Salamadina Tour will process your visa once all required documents are received, " +
          "or at the latest 3 weeks before departure."
      },
      ind: {
        question: "Siapakah yang akan memproses visa? Dan kapan waktu proses visa?",
        answer:
          "Proses visa dilakukan oleh Salamadina Tour setelah menerima seluruh dokumen persyaratan, " +
          "atau paling cepat 3 minggu sebelum keberangkatan."
      }
    }
  },
  {
    id: "faq5",
    categories: ["passport", "requirements"],
    translations: {
      en: {
        question: "What documents are required for a passport application?",
        answer:
          "Required documents include:\n" +
          "• Original ID Card (KTP) and A4 photocopy.\n" +
          "• Original Family Card (KK) and photocopy.\n" +
          "• Original Birth Certificate or Diploma and photocopy.\n" +
          "• Original Marriage Book and photocopy (for couples).\n" +
          "• Travel Recommendation Letter.\n" +
          "• Original Old Passport and photocopy (for renewal).\n" +
          "• Original Parent’s Passport and photocopy (for child passport).\n" +
          "• Original Parent’s ID and photocopy (for child passport).\n" +
          "• Original Parent’s Marriage Book and photocopy (for child passport)."
      },
      ind: {
        question: "Apa saja dokumen persyaratan untuk pembuatan paspor?",
        answer:
          "Dokumen persyaratan untuk pembuatan paspor antara lain:\n" +
          "• KTP Asli dan fotokopi (A4).\n" +
          "• KK Asli dan fotokopi.\n" +
          "• Akta Lahir Asli/Ijazah Asli dan fotokopi.\n" +
          "• Buku Nikah Asli dan fotokopi (bagi pasangan suami istri).\n" +
          "• Surat Rekomendasi dari Travel.\n" +
          "• Paspor Lama Asli dan fotokopi (perpanjangan).\n" +
          "• Paspor Asli Orang Tua dan fotokopi (paspor anak).\n" +
          "• KTP Asli Orang Tua dan fotokopi (paspor anak).\n" +
          "• Buku Nikah Asli Orang Tua dan fotokopi (paspor anak)."
      }
    }
  },
  {
    id: "faq6",
    categories: ["passport", "requirements"],
    translations: {
      en: {
        question: "What are the steps to apply for a passport?",
        answer:
          "1. Download the “Layanan Paspor Online” app from the Playstore.\n" +
          "2. Create an account with an email linked to your phone.\n" +
          "3. Fill in your personal data and save.\n" +
          "4. Select an Immigration Office and appointment slot.\n" +
          "5. Save and print the generated barcode.\n" +
          "6. Visit the office with originals + 2 photocopies each.\n" +
          "7. Complete interview, photo, and fingerprint.\n" +
          "8. Receive payment receipt and pay at post office/bank.\n" +
          "9. Collect your passport 5–7 days after payment."
      },
      ind: {
        question: "Bagaimana langkah-langkah dalam pembuatan paspor?",
        answer:
          "1. Unduh aplikasi “Layanan Paspor Online” di Playstore.\n" +
          "2. Buat akun dengan email yang terhubung HP.\n" +
          "3. Isi data diri dan klik “Simpan”.\n" +
          "4. Pilih Kantor Imigrasi dan jadwal.\n" +
          "5. Simpan & cetak barcode.\n" +
          "6. Datang dengan dokumen asli + 2 fotokopi masing-masing.\n" +
          "7. Proses wawancara, foto, dan sidik jari.\n" +
          "8. Terima bukti pembayaran, bayar di kantor pos/bank.\n" +
          "9. Ambil paspor 5–7 hari setelah pembayaran."
      }
    }
  },
  {
    id: "faq7",
    categories: ["passport", "requirements"],
    translations: {
      en: {
        question: "What if the passport name has only one word?",
        answer:
          "If the name is only one word, you can add your father’s and paternal grandfather’s names " +
          "according to your Family Card or Birth Certificate."
      },
      ind: {
        question: "Bagaimana jika nama dalam pembuatan paspor hanya 1 kata?",
        answer:
          "Jika nama hanya 1 kata, dapat ditambahkan nama Ayah dan Kakek sesuai dokumen KK/Akte/Buku Nikah."
      }
    }
  },
  {
    id: "faq8",
    categories: ["passport", "requirements"],
    translations: {
      en: {
        question: "What if there’s a discrepancy in my personal documents?",
        answer:
          "You may obtain Form A5 or a Certificate from your local office to correct discrepancies, " +
          "but please consult our passport team first."
      },
      ind: {
        question:
          "Apabila ada perbedaan nama/tgl lahir/orang tua di dokumen, apakah bisa untuk proses paspor?",
        answer:
          "Jika ada perbedaan, Anda bisa mengurus Form A5 atau Surat Keterangan di Kelurahan, " +
          "tapi disarankan hubungi tim paspor kami terlebih dahulu."
      }
    }
  },
  {
    id: "faq9",
    categories: ["passport", "requirements"],
    translations: {
      en: {
        question: "Can I use my existing single-word passport for visa processing?",
        answer:
          "If your passport name has fewer than two words, you must add names via the immigration office before visa processing."
      },
      ind: {
        question:
          "Apabila sudah memiliki paspor tapi hanya 1 suku kata, apakah bisa untuk visa?",
        answer:
          "Jika kurang dari 2 suku kata, Anda harus menambahkan nama di Kantor Imigrasi sebelum proses visa."
      }
    }
  },
  {
    id: "faq10",
    categories: ["passport", "requirements"],
    translations: {
      en: {
        question: "How do I process a name addition?",
        answer:
          "Visit your Immigration Office with:\n" +
          "• Original Passport\n" +
          "• Original KTP + A4 photocopy\n" +
          "• Original KK + photocopy\n" +
          "• Travel Recommendation Letter"
      },
      ind: {
        question: "Bagaimana cara memproses penambahan nama?",
        answer:
          "Datang ke Kantor Imigrasi dengan:\n" +
          "• Paspor Asli\n" +
          "• KTP Asli + fotokopi A4\n" +
          "• KK Asli + fotokopi\n" +
          "• Surat Rekomendasi Travel"
      }
    }
  },
  {
    id: "faq11",
    categories: ["passport", "requirements"],
    translations: {
      en: {
        question: "How can I get a travel recommendation letter?",
        answer:
          "After paying the down payment, send scanned copies of your KTP and KK so we can issue a recommendation letter for your immigration appointment."
      },
      ind: {
        question: "Bagaimana cara mendapatkan surat rekomendasi dari travel?",
        answer:
          "Setelah membayar DP, kirimkan scan KTP dan KK agar kami dapat membuat surat rekomendasi untuk Kantor Imigrasi."
      }
    }
  }
];



export async function POST(request: Request) {
  try {
    const results = await Promise.all(
      faqs.map(async (faqData) => {
        // Create the document with initial timestamp values.
        const docRef = await addDoc(collection(db, 'faq'), {
          ...faqData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Return the testimonial including its id at the top level and inside desc.
        return {
          id: docRef.id,
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Testimonials seeded successfully',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed testimonials' },
      { status: 500 }
    );
  }
}
*/
