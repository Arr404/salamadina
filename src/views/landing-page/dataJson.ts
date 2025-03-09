interface ILocation {
  number: number;
  name: string;
  address: string;
  phone: string | null;
  lat: number | null;
  long: number | null;
}

const dataJson: ILocation[] = [
  {
    "number": 1,
    "name": "SUPI AYUMI",
    "address": "BLIMBING RT 003 RW 001",
    "phone": "085748156126",
    "lat": -7.463271,
    "long": 112.382535
  },
  {
    "number": 2,
    "name": "ENY ANJAR RUSLIYAH",
    "address": "DUSUN JATIREJO RT 001 RW 004",
    "phone": "081210213478",
    "lat": -7.611573,
    "long": 112.514777
  },
  {
    "number": 3,
    "name": "MOH ZUHDI",
    "address": "JL KAPTEN TENDEAN DSN. KALIMALANG RT 003 RW 006",
    "phone": "081297442494",
    "lat": -7.850239,
    "long": 112.029772
  },
  {
    "number": 4,
    "name": "ELINA RODHIYAH",
    "address": "DSN SUMBERSUKO RT 004 RW 011",
    "phone": "08563484577",
    "lat": -8.166455,
    "long": 113.188043
  },
  {
    "number": 5,
    "name": "SUHARNO",
    "address": "DSN PLANDAAN RT 008 RW 002",
    "phone": "082142209438",
    "lat": -7.467844,
    "long": 112.177471
  },
  {
    "number": 6,
    "name": "MUHAMMAD ROSYID RIDHA",
    "address": "DSN KAROBELAH 2 RT 001 RW 002",
    "phone": "082139303566",
    "lat": -7.528607,
    "long": 112.349569
  },
  {
    "number": 7,
    "name": "JALI",
    "address": "JLN MENGO RT 001 RW 005",
    "phone": "085749780694",
    "lat": null,
    "long": null
  },
  {
    "number": 8,
    "name": "EFFI WAHYUNI",
    "address": "DSN SUMBER BENDO RT 003 RW 006",
    "phone": "085853859121",
    "lat": -7.593706,
    "long": 112.267748
  },
  {
    "number": 9,
    "name": "MAULANA SYAHIDUS ZAMAN",
    "address": "DSN KUWIK RT 003 RW 001",
    "phone": "085785946280",
    "lat": -7.682218,
    "long": 112.199734
  },
  {
    "number": 10,
    "name": "M LUTHFI",
    "address": "JL MERPATI RT 017 RW 006",
    "phone": "08568868254",
    "lat": null,
    "long": null
  },
  {
    "number": 11,
    "name": "POERWANTO",
    "address": "PRAJURIT KULON V RT 001 RW 002",
    "phone": "085707060116",
    "lat": -7.473697,
    "long": 112.428182
  },
  {
    "number": 12,
    "name": "LISNA SOFIYA AMALY",
    "address": "SOOKO GG I NO 4 RT 001 RW 001",
    "phone": "081234777106",
    "lat": -7.487790,
    "long": 112.434962
  },
  {
    "number": 13,
    "name": "WIRAWAN",
    "address": "JL KH ISMAIL Gg II/38 RT 019 RW 008",
    "phone": "081357895212",
    "lat": -7.523582,
    "long": 112.407911
  },
  {
    "number": 14,
    "name": "YUNAN FUADI",
    "address": "DSN. BRENJUK RT 001 RW 002",
    "phone": "085656414472",
    "lat": -7.935537,
    "long": 111.958606
  },
  {
    "number": 15,
    "name": "AFFAN UCHRON",
    "address": "PERUM GRIYA SUMBER KAV 20 JL SUMBER RT 002 RW 004",
    "phone": "08113789821",
    "lat": -8.144655,
    "long": 112.559143
  },
  {
    "number": 16,
    "name": "ANA ZAKIYAH",
    "address": "NGELOM MEGARE RT 006 RW 001",
    "phone": "081332930556",
    "lat": -7.348137,
    "long": 112.687101
  },
  {
    "number": 17,
    "name": "FATIH IHSANI",
    "address": "KEMASAN KRIAN RT 001 RW 001",
    "phone": "085748358742",
    "lat": -7.400092,
    "long": 112.591547
  },
  {
    "number": 18,
    "name": "MUCHAMMAD ZAHRIL IBAD",
    "address": "GG TERSANJUNG RT 001 RW 001",
    "phone": "085746721797",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 19,
    "name": "SITI FATIMAH",
    "address": "GRIYA KENAGUNG C21 RT 031 RW 008",
    "phone": "082245428271",
    "lat": -7.983908,
    "long": 112.621391
  },
  {
    "number": 20,
    "name": "HARYONO",
    "address": "MARGOREJO 2-G/11 A RT 004 RW 003",
    "phone": "082232167822",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 21,
    "name": "AHMAD BUSAIRI",
    "address": "KP PESISIR UTARA RT 003 RW 001",
    "phone": "081329501530",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 22,
    "name": "DIMAS HASBI ASSIDDIQI",
    "address": "SUNAN GIRI 18E/25 RT 002 RW 001",
    "phone": "085746878162",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 23,
    "name": "NUNG MUAWANAH",
    "address": "BANGKA 32 RT 002 RW 008",
    "phone": "081357912520",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 24,
    "name": "SUNDARI MEI NUR HAYATI",
    "address": "LEMAHBANG RT 001 RW 002",
    "phone": null,
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 25,
    "name": "FAJAR ISLAMI HUMAN",
    "address": "PANGKATREJO RT 001 RW 001",
    "phone": "085220754346",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 26,
    "name": "ABDUL GHOFIR",
    "address": "PERUM GRIYA ASRRI TASIKMADU D 10 RT 001 RW 002",
    "phone": "081217453225",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 27,
    "name": "VIVIN NOVALIANA",
    "address": "JL KYAI ILYAS NO 102/88 RT 003 RW 003",
    "phone": "082331792000",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 28,
    "name": "YAYUK MUJIRAHAYU",
    "address": "DSN KRAJAN RT 002 RW 001",
    "phone": "082225496297",
    "lat": -8.061111,
    "long": 112.152222
  },
  {
    "number": 29,
    "name": "MUNAAMUL AZIZIDID",
    "address": "DS LESTARI GG 3 RT 001 RW 003",
    "phone": "082333818640",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 30,
    "name": "ABDUL KHOLIQ",
    "address": "JL KH WACHID HASYIM NO 20 RT 001 RW 005",
    "phone": "082139641832",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 31,
    "name": "SUDARJI",
    "address": "JL MANGGA NO 35 RT 002 RW 002",
    "phone": "081259667404",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 32,
    "name": "SETO ADI MUSTIKO",
    "address": "PONPES JAMILURROHMAN RT 004 RW -",
    "phone": "085235272710",
    "lat": -7.250445,
    "long": 112.768845
  },
  {
    "number": 33,
    "name": "HUSEN DANUNG SULAKSANA",
    "address": "KEDUNGREJO RT 002 RW 004, Desa Klitik, Kec. Geneng, Kab. Ngawi",
    "phone": "087855719246",
    "lat": -7.483333,
    "long": 111.416667
  },
  {
    "number": 34,
    "name": "IMAM MUSLIH",
    "address": "JL KENARI RT 002 RW 002, Kel. Giri, Kec. Giri, Kab. Banyuwangi",
    "phone": "085330115659",
    "lat": -8.2192,
    "long": 114.3691
  },
  {
    "number": 35,
    "name": "IHWANAROTAMA BELLA INDRIASANDI",
    "address": "Dsn. Krajan RT 002 RW 002, Kel. Kalibaru Wetan, Kec. Kalibaru, Kab. Banyuwangi",
    "phone": "081335458557",
    "lat": -8.2286,
    "long": 114.1141
  }
]

export default dataJson;
