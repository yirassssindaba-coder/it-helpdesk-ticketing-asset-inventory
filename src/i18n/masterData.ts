import { Language } from './translations';

type MultiLang = Partial<Record<Language, string>>;
type LookupTable = Record<string, MultiLang>;

export const DIVISION_NAMES: LookupTable = {
  'Finance': {
    id: 'Keuangan', en: 'Finance', de: 'Finanzen',
    zh: '财务部', ja: '財務部', vi: 'Tài chính',
  },
  'Marketing': {
    id: 'Marketing', en: 'Marketing', de: 'Marketing',
    zh: '市场部', ja: 'マーケティング', vi: 'Tiếp thị',
  },
  'Engineering': {
    id: 'Teknik', en: 'Engineering', de: 'Technik',
    zh: '工程部', ja: 'エンジニアリング', vi: 'Kỹ thuật',
  },
  'HR': {
    id: 'SDM', en: 'HR', de: 'Personalwesen',
    zh: '人力资源部', ja: '人事部', vi: 'Nhân sự',
  },
  'Operations': {
    id: 'Operasional', en: 'Operations', de: 'Betrieb',
    zh: '运营部', ja: '業務部', vi: 'Vận hành',
  },
  'IT': {
    id: 'IT', en: 'IT', de: 'IT',
    zh: 'IT部', ja: 'IT部', vi: 'IT',
  },
  'Data Center': {
    id: 'Pusat Data', en: 'Data Center', de: 'Rechenzentrum',
    zh: '数据中心', ja: 'データセンター', vi: 'Trung tâm dữ liệu',
  },
  'Cloud': {
    id: 'Cloud', en: 'Cloud', de: 'Cloud',
    zh: '云端', ja: 'クラウド', vi: 'Đám mây',
  },
  'IT Team': {
    id: 'Tim IT', en: 'IT Team', de: 'IT-Team',
    zh: 'IT团队', ja: 'ITチーム', vi: 'Nhóm IT',
  },
  'All Employees': {
    id: 'Semua Karyawan', en: 'All Employees', de: 'Alle Mitarbeiter',
    zh: '全体员工', ja: '全従業員', vi: 'Tất cả nhân viên',
  },
  'Stock': {
    id: 'Stok', en: 'Stock', de: 'Lager',
    zh: '库存', ja: '在庫', vi: 'Kho',
  },
  'Shared - Divisi HR': {
    id: 'Bersama – Divisi SDM', en: 'Shared – HR Division', de: 'Geteilt – HR-Abteilung',
    zh: '共享 – 人力资源部', ja: '共用 – 人事部', vi: 'Chung – Bộ phận Nhân sự',
  },
};

export const PERSON_NAMES: LookupTable = {
  'Ahmad Fauzi': {
    id: 'Ahmad Fauzi', en: 'Ahmad Fauzi', de: 'Ahmad Fauzi',
    zh: '阿赫玛德·福兹', ja: 'アフマド・ファウジ', vi: 'Ahmad Fauzi',
  },
  'Siti Rahayu': {
    id: 'Siti Rahayu', en: 'Siti Rahayu', de: 'Siti Rahayu',
    zh: '西蒂·拉哈尤', ja: 'シティ・ラハユ', vi: 'Siti Rahayu',
  },
  'Dedi Kurniawan': {
    id: 'Dedi Kurniawan', en: 'Dedi Kurniawan', de: 'Dedi Kurniawan',
    zh: '德迪·库尔尼亚万', ja: 'デディ・クルニアワン', vi: 'Dedi Kurniawan',
  },
  'Rina Wati': {
    id: 'Rina Wati', en: 'Rina Wati', de: 'Rina Wati',
    zh: '莉娜·瓦蒂', ja: 'リナ・ワティ', vi: 'Rina Wati',
  },
  'Joko Widodo': {
    id: 'Joko Widodo', en: 'Joko Widodo', de: 'Joko Widodo',
    zh: '佐科·维多多', ja: 'ジョコ・ウィドド', vi: 'Joko Widodo',
  },
  'Budi Santoso': {
    id: 'Budi Santoso', en: 'Budi Santoso', de: 'Budi Santoso',
    zh: '布迪·桑托索', ja: 'ブディ・サントソ', vi: 'Budi Santoso',
  },
  'Dewi Ayu': {
    id: 'Dewi Ayu', en: 'Dewi Ayu', de: 'Dewi Ayu',
    zh: '黛薇·阿尤', ja: 'デウィ・アユ', vi: 'Dewi Ayu',
  },
  'Rizal Hakim': {
    id: 'Rizal Hakim', en: 'Rizal Hakim', de: 'Rizal Hakim',
    zh: '里扎尔·哈基姆', ja: 'リザル・ハキム', vi: 'Rizal Hakim',
  },
  'Data Center': {
    id: 'Pusat Data', en: 'Data Center', de: 'Rechenzentrum',
    zh: '数据中心', ja: 'データセンター', vi: 'Trung tâm dữ liệu',
  },
  'IT Team': {
    id: 'Tim IT', en: 'IT Team', de: 'IT-Team',
    zh: 'IT团队', ja: 'ITチーム', vi: 'Nhóm IT',
  },
  'Unassigned': {
    id: 'Belum Ditugaskan', en: 'Unassigned', de: 'Nicht zugewiesen',
    zh: '未分配', ja: '未割り当て', vi: 'Chưa phân công',
  },
};

export const TICKET_TITLES: LookupTable = {
  'Laptop tidak bisa menyala': {
    id: 'Laptop tidak bisa menyala',
    en: 'Laptop won\'t turn on',
    de: 'Laptop lässt sich nicht einschalten',
    zh: '笔记本电脑无法开机',
    ja: 'ノートPCが起動しない',
    vi: 'Máy tính xách tay không khởi động được',
  },
  'Install Microsoft Office': {
    id: 'Pasang Microsoft Office',
    en: 'Install Microsoft Office',
    de: 'Microsoft Office installieren',
    zh: '安装 Microsoft Office',
    ja: 'Microsoft Office のインストール',
    vi: 'Cài đặt Microsoft Office',
  },
  'Akses VPN bermasalah': {
    id: 'Akses VPN bermasalah',
    en: 'VPN access issue',
    de: 'VPN-Zugriffsproblem',
    zh: 'VPN 访问问题',
    ja: 'VPNアクセスの問題',
    vi: 'Vấn đề truy cập VPN',
  },
  'Printer tidak terdeteksi': {
    id: 'Printer tidak terdeteksi',
    en: 'Printer not detected',
    de: 'Drucker wird nicht erkannt',
    zh: '打印机未被检测到',
    ja: 'プリンターが検出されない',
    vi: 'Máy in không được phát hiện',
  },
  'Reset password email': {
    id: 'Reset password email',
    en: 'Email password reset',
    de: 'E-Mail-Passwort zurücksetzen',
    zh: '重置邮箱密码',
    ja: 'メールパスワードのリセット',
    vi: 'Đặt lại mật khẩu email',
  },
};

export const LOCATION_NAMES: LookupTable = {
  'Gedung A - Lt. 3': {
    id: 'Gedung A – Lt. 3', en: 'Building A – Floor 3', de: 'Gebäude A – Etage 3',
    zh: 'A栋 – 3楼', ja: 'Aビル – 3階', vi: 'Tòa A – Tầng 3',
  },
  'Gedung A - Lt. 2': {
    id: 'Gedung A – Lt. 2', en: 'Building A – Floor 2', de: 'Gebäude A – Etage 2',
    zh: 'A栋 – 2楼', ja: 'Aビル – 2階', vi: 'Tòa A – Tầng 2',
  },
  'Gedung B - Lt. 1': {
    id: 'Gedung B – Lt. 1', en: 'Building B – Floor 1', de: 'Gebäude B – Etage 1',
    zh: 'B栋 – 1楼', ja: 'Bビル – 1階', vi: 'Tòa B – Tầng 1',
  },
  'Gedung A - Basement': {
    id: 'Gedung A – Basement', en: 'Building A – Basement', de: 'Gebäude A – Untergeschoss',
    zh: 'A栋 – 地下室', ja: 'Aビル – 地下', vi: 'Tòa A – Tầng hầm',
  },
  'Server Room - Rack A1': {
    id: 'Ruang Server – Rak A1', en: 'Server Room – Rack A1', de: 'Serverraum – Rack A1',
    zh: '服务器机房 – 机架A1', ja: 'サーバー室 – ラックA1', vi: 'Phòng máy chủ – Giá A1',
  },
  'Gedung A - Lt. 4': {
    id: 'Gedung A – Lt. 4', en: 'Building A – Floor 4', de: 'Gebäude A – Etage 4',
    zh: 'A栋 – 4楼', ja: 'Aビル – 4階', vi: 'Tòa A – Tầng 4',
  },
  'Gudang IT': {
    id: 'Gudang IT', en: 'IT Storage Room', de: 'IT-Lagerraum',
    zh: 'IT仓库', ja: 'IT倉庫', vi: 'Kho IT',
  },
  'Cloud': {
    id: 'Cloud', en: 'Cloud', de: 'Cloud',
    zh: '云端', ja: 'クラウド', vi: 'Đám mây',
  },
};

export function localizeValue(
  value: string,
  table: LookupTable,
  lang: Language,
): string {
  if (!value) return value;
  const entry = table[value];
  if (!entry) return value;
  return entry[lang] ?? entry['en'] ?? value;
}
