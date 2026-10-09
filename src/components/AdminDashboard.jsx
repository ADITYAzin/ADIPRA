import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleSignInButton } from './GoogleSignInButton';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Upload,
  Loader2,
  X,
  Search,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  LayoutDashboard,
  FileText,
  Award,
  BookOpen,
  FolderKanban,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  HelpCircle,
  Tag,
  Layers,
  Calendar,
  Building2,
  Globe,
  Palette,
  PenTool,
  LayoutGrid,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const TAB_CONFIG = [
  { value: 'projects', label: 'Proyek', icon: FolderKanban, desc: 'Kelola portofolio karya & studi kasus' },
  { value: 'competitions', label: 'Kompetisi', icon: Award, desc: 'Kelola sertifikat & pencapaian lomba' },
  { value: 'trainings', label: 'Pelatihan', icon: BookOpen, desc: 'Kelola sertifikat kursus & bootcamp' },
  { value: 'articles', label: 'Artikel', icon: FileText, desc: 'Kelola publikasi tulisan & dokumentasi acara' },
];

const PROJECT_CATEGORIES = [
  {
    id: 'uiux',
    label: 'UI/UX Design',
    icon: LayoutGrid,
    badgeClass: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400',
    description: 'Studi kasus interaktif dengan breakdown deskripsi, proses pengembangan, dan hasil akhir.',
    suggestedTags: ['Mobile App', 'UI Design', 'UX Research', 'Design System', 'Prototyping'],
    detailPlaceholder: `### Ringkasan & Latar Belakang Masalah\nJelaskan masalah yang ingin diselesaikan...\n\n### Proses & Metodologi\n• Riset Pengguna\n• User Flow & Wireframing\n• Design System\n\n### Peran & Kontribusi\n• UI/UX Designer`,
  },
  {
    id: 'brand',
    label: 'Brand Design',
    icon: Palette,
    badgeClass: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400',
    description: 'Identitas visual brand, eksplorasi konsep logo, filosofi nilai, dan penerapan pada media.',
    suggestedTags: ['Brand Identity', 'Logo Design', 'Visual Guidelines', 'Typography', 'Stationery'],
    detailPlaceholder: `### Konsep Brand\nJelaskan latar belakang brand dan kepribadian visual yang dibangun...\n\n### Eksplorasi Logo & Filosofi\nJelaskan makna di balik bentuk simbol logo dan palet warna pilihan...\n\n### Penerapan Media\nJelaskan implementasi brand pada berbagai media sentuh.`,
  },
  {
    id: 'graphic',
    label: 'Graphic Design',
    icon: PenTool,
    badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400',
    description: 'Karya visual instan (Poster, Feed Medsos, Kemasan) yang langsung dibuka via Lightbox.',
    suggestedTags: ['Poster', 'Social Media', 'Feed', 'Packaging', 'Stiker', 'Cover'],
    detailPlaceholder: `Deskripsi karya grafis, konteks acara/publikasi, atau catatan teknis komposisi visual (opsional).`,
  },
  {
    id: 'web',
    label: 'Web Development',
    icon: Globe,
    badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400',
    description: 'Dokumentasi proyek web engineering dengan tech stack, arsitektur, dan preview tampilan responsif.',
    suggestedTags: ['Frontend', 'Web App', 'IoT Platform', 'React', 'Tailwind CSS', 'Astro'],
    detailPlaceholder: `### Arsitektur & Teknologi\nJelaskan tech stack yang digunakan...\n\n### Fitur Utama\n• Responsif UI\n• Integrasi API / IoT\n• Optimasi Performa`,
  },
];

const INITIAL_PROJECT_FORM = {
  id: '',
  title: '',
  category: 'uiux',
  year: new Date().getFullYear(),
  tags: '',
  cover: '',
  description: '',
  detail: '',
  gallery: [],
  process_images: [],
  result_images: [],
};

const INITIAL_CERT_FORM = {
  id: '',
  title: '',
  issuer: '',
  year: new Date().getFullYear(),
  category: 'Kompetisi',
  img: '',
};

const INITIAL_ARTICLE_FORM = {
  id: '',
  title: '',
  category: 'Event',
  date: new Date().toISOString().split('T')[0],
  tags: '',
  cover: '',
  description: '',
  content: '',
};

function Toast({ type, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl ${bg} px-5 py-3.5 shadow-soft-xl animate-in slide-in-from-bottom-4 fade-in duration-300`}>
      <Icon className="size-5 shrink-0" />
      <p className="text-base font-semibold">{message}</p>
      <button onClick={onClose} className="ml-2 rounded-full p-1.5 hover:bg-white/20 transition-colors" aria-label="Tutup notifikasi">
        <X className="size-4" />
      </button>
    </div>
  );
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-destructive">
          <div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10">
            <Trash2 className="size-5" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
        </div>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading} className="text-base px-4 py-2">
            Batal
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading} className="gap-2 text-base px-5 py-2">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Hapus Permanen
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, count, desc, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col text-left rounded-2xl border p-5 transition-all duration-200 ${
        active
          ? 'border-primary bg-primary/5 shadow-soft-md ring-2 ring-primary/20'
          : 'border-border bg-card hover:border-primary/40 hover:bg-card/80 shadow-soft-sm'
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
          active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:text-foreground'
        }`}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="mt-3">
        <p className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">{count}</p>
        <p className="mt-1.5 text-sm font-medium text-muted-foreground line-clamp-1">{desc}</p>
      </div>
    </button>
  );
}

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState('projects');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [counts, setCounts] = useState({});

  // View state: 'list' | 'editor'
  const [viewMode, setViewMode] = useState('list');
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newProcessUrl, setNewProcessUrl] = useState('');
  const [newResultUrl, setNewResultUrl] = useState('');

  // Form states
  const [projectForm, setProjectForm] = useState({ ...INITIAL_PROJECT_FORM });
  const [certForm, setCertForm] = useState({ ...INITIAL_CERT_FORM });
  const [articleForm, setArticleForm] = useState({ ...INITIAL_ARTICLE_FORM });

  const [toast, setToast] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (type, message) => setToast({ type, message });
  const closeToast = () => setToast(null);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    }) || { data: { subscription: null } };
    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchItems();
      fetchCounts();
    }
  }, [session, activeTab]);

  const fetchCounts = async () => {
    if (!supabase) return;
    const result = {};
    for (const t of TAB_CONFIG) {
      const { count, error } = await supabase.from(t.value).select('id', { count: 'exact', head: true });
      if (!error) result[t.value] = count ?? 0;
    }
    setCounts(result);
  };

  const fetchItems = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from(activeTab).select('*').order('created_at', { ascending: false });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Email dan password harus diisi.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('success', 'Berhasil keluar.');
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const startCreate = () => {
    setEditingItem(null);
    if (activeTab === 'projects') {
      setProjectForm({
        ...INITIAL_PROJECT_FORM,
        year: new Date().getFullYear(),
        process_images: [],
        result_images: [],
      });
      setNewProcessUrl('');
      setNewResultUrl('');
    } else if (activeTab === 'competitions' || activeTab === 'trainings') {
      setCertForm({
        ...INITIAL_CERT_FORM,
        category: activeTab === 'competitions' ? 'Kompetisi' : 'Pelatihan',
        year: new Date().getFullYear(),
      });
    } else if (activeTab === 'articles') {
      setArticleForm({
        ...INITIAL_ARTICLE_FORM,
        date: new Date().toISOString().split('T')[0],
      });
    }
    setViewMode('editor');
  };

  const startEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'projects') {
      const procImgs = Array.isArray(item.process_images)
        ? item.process_images
        : (item.process_images ? item.process_images.split(',').map(s => s.trim()).filter(Boolean) : []);
      const resImgs = Array.isArray(item.result_images)
        ? item.result_images
        : (item.result_images ? item.result_images.split(',').map(s => s.trim()).filter(Boolean) : []);

      let legacyGal = Array.isArray(item.gallery)
        ? item.gallery
        : (item.gallery ? item.gallery.split(',').map(s => s.trim()).filter(Boolean) : []);

      // Dukung backward-compatibility dengan tag proc:: dan res:: pada kolom gallery lama
      const taggedProc = legacyGal.filter(url => typeof url === 'string' && url.startsWith('proc::')).map(url => url.replace('proc::', ''));
      const taggedRes = legacyGal.filter(url => typeof url === 'string' && url.startsWith('res::')).map(url => url.replace('res::', ''));

      let finalProc = procImgs.length > 0 ? procImgs : taggedProc;
      let finalRes = resImgs.length > 0 ? resImgs : taggedRes;

      if (finalProc.length === 0 && finalRes.length === 0 && legacyGal.length > 0) {
        const cleanGal = legacyGal.map(url => typeof url === 'string' ? url.replace(/^(proc|res)::/, '') : url);
        if (item.category === 'uiux' || item.category === 'web') {
          finalProc = cleanGal.slice(0, Math.max(1, Math.floor(cleanGal.length / 2)));
          finalRes = cleanGal.slice(Math.max(1, Math.floor(cleanGal.length / 2)));
        } else {
          finalRes = cleanGal;
        }
      }

      setProjectForm({
        id: item.id || '',
        title: item.title || '',
        category: item.category || 'uiux',
        year: item.year || new Date().getFullYear(),
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
        cover: item.cover || '',
        description: item.description || '',
        detail: item.detail || '',
        gallery: legacyGal,
        process_images: finalProc,
        result_images: finalRes,
      });
      setNewProcessUrl('');
      setNewResultUrl('');
    } else if (activeTab === 'competitions' || activeTab === 'trainings') {
      setCertForm({
        id: item.id || '',
        title: item.title || '',
        issuer: item.issuer || '',
        year: item.year || new Date().getFullYear(),
        category: item.category || (activeTab === 'competitions' ? 'Kompetisi' : 'Pelatihan'),
        img: item.img || '',
      });
    } else if (activeTab === 'articles') {
      setArticleForm({
        id: item.id || '',
        title: item.title || '',
        category: item.category || 'Event',
        date: item.date || new Date().toISOString().split('T')[0],
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
        cover: item.cover || '',
        description: item.description || '',
        content: item.content || '',
      });
    }
    setViewMode('editor');
  };

  const handleFileUpload = async (e, targetField, replaceIndex = null) => {
    const fileList = e.target.files ? Array.from(e.target.files) : [];
    if (fileList.length === 0 || !supabase) return;
    setUploading(true);

    try {
      const uploadedUrls = [];
      for (const file of fileList) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${activeTab}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
        if (uploadError) {
          throw new Error('Gagal upload gambar: ' + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
      }

      if (activeTab === 'projects') {
        if (targetField === 'cover') {
          setProjectForm(prev => ({ ...prev, cover: uploadedUrls[0] }));
        } else if (targetField === 'process_images') {
          if (replaceIndex !== null) {
            setProjectForm(prev => {
              const updated = [...prev.process_images];
              updated[replaceIndex] = uploadedUrls[0];
              return { ...prev, process_images: updated };
            });
          } else {
            setProjectForm(prev => ({ ...prev, process_images: [...prev.process_images, ...uploadedUrls] }));
          }
        } else if (targetField === 'result_images') {
          if (replaceIndex !== null) {
            setProjectForm(prev => {
              const updated = [...prev.result_images];
              updated[replaceIndex] = uploadedUrls[0];
              return { ...prev, result_images: updated };
            });
          } else {
            setProjectForm(prev => ({ ...prev, result_images: [...prev.result_images, ...uploadedUrls] }));
          }
        }
      } else if (activeTab === 'competitions' || activeTab === 'trainings') {
        setCertForm(prev => ({ ...prev, img: uploadedUrls[0] }));
      } else if (activeTab === 'articles') {
        setArticleForm(prev => ({ ...prev, cover: uploadedUrls[0] }));
      }

      showToast('success', `${uploadedUrls.length} Gambar berhasil diupload!`);
    } catch (err) {
      showToast('error', err.message || 'Gagal upload gambar');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Helper CRUD Gambar Proses Pengembangan
  const addProcessUrl = () => {
    if (!newProcessUrl.trim()) return;
    setProjectForm(prev => ({
      ...prev,
      process_images: [...prev.process_images, newProcessUrl.trim()],
    }));
    setNewProcessUrl('');
  };

  const removeProcessImage = (index) => {
    setProjectForm(prev => ({
      ...prev,
      process_images: prev.process_images.filter((_, i) => i !== index),
    }));
  };

  const updateProcessImage = (index, value) => {
    setProjectForm(prev => {
      const updated = [...prev.process_images];
      updated[index] = value;
      return { ...prev, process_images: updated };
    });
  };

  const moveProcessImage = (fromIndex, toIndex) => {
    setProjectForm(prev => {
      if (toIndex < 0 || toIndex >= prev.process_images.length) return prev;
      const updated = [...prev.process_images];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return { ...prev, process_images: updated };
    });
  };

  // Helper CRUD Gambar Hasil Akhir
  const addResultUrl = () => {
    if (!newResultUrl.trim()) return;
    setProjectForm(prev => ({
      ...prev,
      result_images: [...prev.result_images, newResultUrl.trim()],
    }));
    setNewResultUrl('');
  };

  const removeResultImage = (index) => {
    setProjectForm(prev => ({
      ...prev,
      result_images: prev.result_images.filter((_, i) => i !== index),
    }));
  };

  const updateResultImage = (index, value) => {
    setProjectForm(prev => {
      const updated = [...prev.result_images];
      updated[index] = value;
      return { ...prev, result_images: updated };
    });
  };

  const moveResultImage = (fromIndex, toIndex) => {
    setProjectForm(prev => {
      if (toIndex < 0 || toIndex >= prev.result_images.length) return prev;
      const updated = [...prev.result_images];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return { ...prev, result_images: updated };
    });
  };

  const addTagSuggestion = (tag) => {
    const currentTags = projectForm.tags ? projectForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    if (!currentTags.includes(tag)) {
      setProjectForm(prev => ({
        ...prev,
        tags: [...currentTags, tag].join(', '),
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);

    let cleanPayload = {};
    if (activeTab === 'projects') {
      const tagsArray = projectForm.tags
        ? projectForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      cleanPayload = {
        id: projectForm.id.trim(),
        title: projectForm.title.trim(),
        category: projectForm.category,
        year: parseInt(projectForm.year, 10) || new Date().getFullYear(),
        tags: tagsArray,
        cover: projectForm.cover.trim(),
        description: projectForm.description.trim(),
        detail: projectForm.detail.trim(),
        process_images: projectForm.process_images,
        result_images: projectForm.result_images,
        gallery: [
          ...projectForm.process_images.map(u => 'proc::' + u),
          ...projectForm.result_images.map(u => 'res::' + u)
        ],
      };
    } else if (activeTab === 'competitions' || activeTab === 'trainings') {
      cleanPayload = {
        id: certForm.id.trim() || generateSlug(certForm.title),
        title: certForm.title.trim(),
        issuer: certForm.issuer.trim(),
        year: parseInt(certForm.year, 10) || new Date().getFullYear(),
        category: certForm.category.trim(),
        img: certForm.img.trim(),
      };
    } else if (activeTab === 'articles') {
      const tagsArray = articleForm.tags
        ? articleForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      cleanPayload = {
        id: articleForm.id.trim(),
        title: articleForm.title.trim(),
        description: articleForm.description.trim(),
        date: articleForm.date,
        category: articleForm.category.trim(),
        tags: tagsArray,
        cover: articleForm.cover.trim(),
        content: articleForm.content.trim(),
      };
    }

    let error;
    if (editingItem) {
      let res = await supabase.from(activeTab).update(cleanPayload).eq('id', editingItem.id);
      // Auto-fallback jika kolom process_images / result_images belum dibuat di DB Supabase
      if (res.error && (res.error.code === '42703' || res.error.message?.includes('process_images') || res.error.message?.includes('result_images'))) {
        const fallbackPayload = { ...cleanPayload };
        delete fallbackPayload.process_images;
        delete fallbackPayload.result_images;
        res = await supabase.from(activeTab).update(fallbackPayload).eq('id', editingItem.id);
      }
      error = res.error;
    } else {
      let res = await supabase.from(activeTab).insert([cleanPayload]);
      // Auto-fallback jika kolom process_images / result_images belum dibuat di DB Supabase
      if (res.error && (res.error.code === '42703' || res.error.message?.includes('process_images') || res.error.message?.includes('result_images'))) {
        const fallbackPayload = { ...cleanPayload };
        delete fallbackPayload.process_images;
        delete fallbackPayload.result_images;
        res = await supabase.from(activeTab).insert([fallbackPayload]);
      }
      error = res.error;
    }

    setLoading(false);
    if (error) {
      showToast('error', 'Gagal menyimpan data: ' + error.message);
    } else {
      showToast('success', editingItem ? 'Data berhasil diperbarui.' : 'Data baru berhasil ditambahkan.');
      setViewMode('list');
      setEditingItem(null);
      fetchItems();
      fetchCounts();
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete || !supabase) return;
    setDeleting(true);
    const { error } = await supabase.from(activeTab).delete().eq('id', pendingDelete);
    setDeleting(false);
    if (error) {
      showToast('error', 'Gagal menghapus: ' + error.message);
    } else {
      showToast('success', 'Data berhasil dihapus.');
      fetchItems();
      fetchCounts();
    }
    setPendingDelete(null);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = !search ||
      (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
      (item.id && item.id.toLowerCase().includes(search.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
      (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

    if (activeTab === 'projects' && categoryFilter !== 'all') {
      return matchesSearch && item.category === categoryFilter;
    }
    return matchesSearch;
  });

  const selectedCategoryConfig = PROJECT_CATEGORIES.find(c => c.id === projectForm.category) || PROJECT_CATEGORIES[0];

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-9 animate-spin text-primary" />
          <p className="text-base font-medium text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto mt-12 max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LayoutDashboard className="size-8" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1.5 text-base text-muted-foreground">Masuk untuk mengelola seluruh konten portofolio</p>
          </div>

          {authError && (
            <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-base text-red-600 dark:text-red-400">
              <AlertCircle className="size-5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-base font-semibold">Email</Label>
              <Input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="h-12 rounded-xl text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-base font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl pr-11 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="h-12 w-full rounded-xl text-base font-semibold" disabled={authLoading}>
              {authLoading ? <Loader2 className="size-5 animate-spin" /> : 'Masuk ke Dashboard'}
            </Button>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider"><span className="bg-card px-3 text-muted-foreground">atau</span></div>
            </div>
            <GoogleSignInButton />
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: EDITOR VIEW (Full Page CRUD Form)
  // ==========================================
  if (viewMode === 'editor') {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Editor Top Bar */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setViewMode('list')}
              className="gap-2 rounded-xl h-11 px-4 text-sm sm:text-base font-medium"
            >
              <ArrowLeft className="size-4" />
              Kembali ke Daftar
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">
                  {TAB_CONFIG.find(t => t.value === activeTab)?.label} CMS
                </span>
                <span className="text-muted-foreground">•</span>
                <Badge variant={editingItem ? 'secondary' : 'default'} className="rounded-md text-xs font-semibold px-2.5 py-0.5">
                  {editingItem ? 'Mode Edit' : 'Tambah Baru'}
                </Badge>
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-0.5">
                {editingItem ? `Edit: ${editingItem.title}` : `Tambah ${TAB_CONFIG.find(t => t.value === activeTab)?.label} Baru`}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setViewMode('list')}
              disabled={loading}
              className="rounded-xl h-11 px-5 text-sm sm:text-base font-medium"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="gap-2 rounded-xl px-6 h-11 text-sm sm:text-base font-semibold shadow-soft-sm"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />}
              {editingItem ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}
            </Button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-8">
          {/* TAB: PROJECTS FORM */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column: Content & Details (8 Cols) */}
              <div className="space-y-6 lg:col-span-8">
                {/* Section 1: Informasi Dasar */}
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft-sm space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <h2 className="font-display text-xl font-bold text-foreground">Informasi Utama</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Judul proyek, identitas slug, dan ringkasan untuk kartu katalog.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="p-title" className="text-base font-semibold">
                        {projectForm.category === 'uiux' && 'Nama Aplikasi / Produk Digital'}
                        {projectForm.category === 'brand' && 'Nama Brand / Klien'}
                        {projectForm.category === 'graphic' && 'Judul Karya Grafis'}
                        {projectForm.category === 'web' && 'Nama Proyek / Aplikasi Web'}
                        {' *'}
                      </Label>
                      <Input
                        id="p-title"
                        required
                        value={projectForm.title}
                        onChange={e => {
                          const val = e.target.value;
                          setProjectForm(p => ({
                            ...p,
                            title: val,
                            // Auto-generate slug if new
                            id: !editingItem && (!p.id || p.id === generateSlug(p.title)) ? generateSlug(val) : p.id
                          }));
                        }}
                        placeholder="Contoh: Samling Smart Waste Management"
                        className="h-12 rounded-xl text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="p-slug" className="text-base font-semibold">Slug URL (ID) *</Label>
                          {!editingItem && (
                            <button
                              type="button"
                              onClick={() => setProjectForm(p => ({ ...p, id: generateSlug(p.title) }))}
                              className="text-sm font-semibold text-primary hover:underline"
                            >
                              Buat dari Judul
                            </button>
                          )}
                        </div>
                        <Input
                          id="p-slug"
                          required
                          disabled={!!editingItem}
                          value={projectForm.id}
                          onChange={e => setProjectForm(p => ({ ...p, id: generateSlug(e.target.value) }))}
                          placeholder="contoh: samling-waste"
                          className="h-12 rounded-xl font-mono text-base"
                        />
                        <p className="text-sm text-muted-foreground">URL halaman: /projects/{projectForm.id || 'slug-proyek'}</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="p-year" className="text-base font-semibold">Tahun Pengerjaan *</Label>
                        <Input
                          id="p-year"
                          type="number"
                          required
                          value={projectForm.year}
                          onChange={e => setProjectForm(p => ({ ...p, year: parseInt(e.target.value, 10) || 2026 }))}
                          className="h-12 rounded-xl text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="p-desc" className="text-base font-semibold">Deskripsi Singkat (Ringkasan Kartu) *</Label>
                      <Textarea
                        id="p-desc"
                        required
                        rows={3}
                        value={projectForm.description}
                        onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Ringkasan 1-2 kalimat yang menjelaskan inti proyek untuk ditampilkan pada kartu portofolio..."
                        className="rounded-xl leading-relaxed text-base p-3.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Detail Studi Kasus (Markdown) */}
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">
                        {projectForm.category === 'uiux' && 'Studi Kasus & Proses UI/UX'}
                        {projectForm.category === 'brand' && 'Konsep & Filosofi Brand'}
                        {projectForm.category === 'graphic' && 'Catatan Karya Grafis (Opsional)'}
                        {projectForm.category === 'web' && 'Dokumentasi & Arsitektur Teknis'}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-0.5">Mendukung format Markdown (judul #, list •, bold **teks**).</p>
                    </div>
                    {projectForm.category === 'graphic' && (
                      <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 text-muted-foreground">
                        Tampil via Lightbox
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      id="p-detail"
                      rows={10}
                      value={projectForm.detail}
                      onChange={e => setProjectForm(p => ({ ...p, detail: e.target.value }))}
                      placeholder={selectedCategoryConfig.detailPlaceholder}
                      className="font-mono text-base leading-relaxed rounded-xl p-3.5"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground pt-1.5">
                      <span>Gunakan baris ganda (Enter 2x) untuk membuat paragraf baru.</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (!projectForm.detail) {
                            setProjectForm(p => ({ ...p, detail: selectedCategoryConfig.detailPlaceholder }));
                          }
                        }}
                        className="font-semibold text-primary hover:underline"
                      >
                        Pasang Template Panduan
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 3: Galeri Konten — Proses Pengembangan (Bagian 01) */}
                <div className="rounded-2xl border-2 border-indigo-500/30 bg-card p-6 sm:p-7 shadow-soft-sm space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <Layers className="size-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Bagian 01</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs font-semibold text-muted-foreground">Proses Desain & Engineering</span>
                          </div>
                          <h2 className="font-display text-xl font-bold text-foreground">
                            Konten Gambar: Proses Pengembangan
                          </h2>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1">
                        {projectForm.process_images.length} Gambar Proses
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Khusus untuk dokumentasi proses kerja — seperti riset pengguna, sketsa ide, wireframe, user flow, arsitektur data, diagram sistem, dan pengujian.
                    </p>
                  </div>

                  {/* Dynamic Image Items List with In-Place Revision */}
                  {projectForm.process_images.length > 0 ? (
                    <div className="space-y-3">
                      {projectForm.process_images.map((url, idx) => (
                        <div
                          key={idx}
                          className="group flex flex-col sm:flex-row items-start sm:items-center gap-3.5 rounded-xl border border-border/80 bg-muted/20 p-3 hover:border-indigo-500/40 transition-colors"
                        >
                          {/* Thumbnail preview */}
                          <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            <img
                              src={url}
                              alt={`Proses ${idx + 1}`}
                              className="size-full object-cover"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                            <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Inline Edit URL / Revisi input */}
                          <div className="min-w-0 flex-1 w-full space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="font-semibold text-foreground/90">
                                Revisi URL Gambar Proses #{idx + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveProcessImage(idx, idx - 1)}
                                  disabled={idx === 0}
                                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 transition-colors"
                                  title="Geser ke atas"
                                >
                                  <ArrowUp className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveProcessImage(idx, idx + 1)}
                                  disabled={idx === projectForm.process_images.length - 1}
                                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 transition-colors"
                                  title="Geser ke bawah"
                                >
                                  <ArrowDown className="size-3.5" />
                                </button>
                              </div>
                            </div>
                            <Input
                              value={url}
                              onChange={e => updateProcessImage(idx, e.target.value)}
                              placeholder="https://..."
                              className="h-10 rounded-lg font-mono text-sm"
                            />
                          </div>

                          {/* Item Actions */}
                          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-1 sm:pt-0">
                            <label
                              title="Ganti / upload ulang file untuk slot ini"
                              className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              <Upload className="size-4" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => handleFileUpload(e, 'process_images', idx)}
                                disabled={uploading}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeProcessImage(idx)}
                              className="flex size-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                              title="Hapus gambar proses ini"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 py-8 text-center">
                      <Layers className="size-9 text-indigo-500/50 mb-2" />
                      <p className="text-sm font-semibold text-foreground">Belum ada gambar proses pengembangan</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Tambahkan tautan gambar sketsa / wireframe atau upload langsung dari perangkat Anda di bawah ini.
                      </p>
                    </div>
                  )}

                  {/* Add Input Bar for Process Images */}
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] p-3.5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      + Tambah Gambar Proses Baru
                    </span>
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <div className="relative flex-1">
                        <Input
                          value={newProcessUrl}
                          onChange={e => setNewProcessUrl(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addProcessUrl();
                            }
                          }}
                          placeholder="Tempel URL gambar proses (wireframe, user flow, sketsa)..."
                          className="h-11 rounded-xl text-sm sm:text-base"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addProcessUrl}
                        disabled={!newProcessUrl.trim()}
                        className="rounded-xl h-11 px-4 text-sm font-semibold shrink-0 gap-1.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                      >
                        <Plus className="size-4" /> Tambah URL
                      </Button>
                      <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shrink-0">
                        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                        Upload Gambar Proses
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={e => handleFileUpload(e, 'process_images')}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 4: Galeri Konten — Hasil Akhir (Bagian 02) */}
                <div className="rounded-2xl border-2 border-emerald-500/30 bg-card p-6 sm:p-7 shadow-soft-sm space-y-5">
                  <div className="border-b border-border/60 pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Sparkles className="size-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Bagian 02</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs font-semibold text-muted-foreground">Showcase & Final Production</span>
                          </div>
                          <h2 className="font-display text-xl font-bold text-foreground">
                            Konten Gambar: Hasil Akhir
                          </h2>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1">
                        {projectForm.result_images.length} Gambar Hasil
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Khusus untuk tampilan produk final yang memukau — seperti mockup layar resolusi tinggi, hasil akhir antarmuka UI web/mobile, dan demo fitur utama.
                    </p>
                  </div>

                  {/* Dynamic Image Items List with In-Place Revision */}
                  {projectForm.result_images.length > 0 ? (
                    <div className="space-y-3">
                      {projectForm.result_images.map((url, idx) => (
                        <div
                          key={idx}
                          className="group flex flex-col sm:flex-row items-start sm:items-center gap-3.5 rounded-xl border border-border/80 bg-muted/20 p-3 hover:border-emerald-500/40 transition-colors"
                        >
                          {/* Thumbnail preview */}
                          <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            <img
                              src={url}
                              alt={`Hasil ${idx + 1}`}
                              className="size-full object-cover"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                            <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Inline Edit URL / Revisi input */}
                          <div className="min-w-0 flex-1 w-full space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="font-semibold text-foreground/90">
                                Revisi URL Gambar Hasil #{idx + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveResultImage(idx, idx - 1)}
                                  disabled={idx === 0}
                                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 transition-colors"
                                  title="Geser ke atas"
                                >
                                  <ArrowUp className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveResultImage(idx, idx + 1)}
                                  disabled={idx === projectForm.result_images.length - 1}
                                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 transition-colors"
                                  title="Geser ke bawah"
                                >
                                  <ArrowDown className="size-3.5" />
                                </button>
                              </div>
                            </div>
                            <Input
                              value={url}
                              onChange={e => updateResultImage(idx, e.target.value)}
                              placeholder="https://..."
                              className="h-10 rounded-lg font-mono text-sm"
                            />
                          </div>

                          {/* Item Actions */}
                          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-1 sm:pt-0">
                            <label
                              title="Ganti / upload ulang file untuk slot ini"
                              className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                              <Upload className="size-4" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => handleFileUpload(e, 'result_images', idx)}
                                disabled={uploading}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeResultImage(idx)}
                              className="flex size-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                              title="Hapus gambar hasil ini"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 py-8 text-center">
                      <Sparkles className="size-9 text-emerald-500/50 mb-2" />
                      <p className="text-sm font-semibold text-foreground">Belum ada gambar hasil akhir</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Tambahkan tautan gambar mockup final atau upload hasil preview antarmuka di bawah ini.
                      </p>
                    </div>
                  )}

                  {/* Add Input Bar for Result Images */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-3.5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                      + Tambah Gambar Hasil Akhir Baru
                    </span>
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <div className="relative flex-1">
                        <Input
                          value={newResultUrl}
                          onChange={e => setNewResultUrl(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addResultUrl();
                            }
                          }}
                          placeholder="Tempel URL gambar hasil akhir (mockup UI, web showcase)..."
                          className="h-11 rounded-xl text-sm sm:text-base"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addResultUrl}
                        disabled={!newResultUrl.trim()}
                        className="rounded-xl h-11 px-4 text-sm font-semibold shrink-0 gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <Plus className="size-4" /> Tambah URL
                      </Button>
                      <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shrink-0">
                        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                        Upload Gambar Hasil
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={e => handleFileUpload(e, 'result_images')}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Properties & Sidebar (4 Cols) */}
              <div className="space-y-6 lg:col-span-4">
                {/* Bidang Proyek / Kategori Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-sm space-y-4">
                  <div className="border-b border-border/60 pb-3">
                    <h3 className="font-display text-lg font-bold text-foreground">Bidang / Kategori Proyek *</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Pilih bidang agar layout website menampilkan data secara tepat.</p>
                  </div>

                  <div className="space-y-2.5">
                    {PROJECT_CATEGORIES.map(cat => {
                      const CatIcon = cat.icon;
                      const isSelected = projectForm.category === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setProjectForm(p => ({ ...p, category: cat.id }))}
                          className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-soft-xs ring-1 ring-primary'
                              : 'border-border bg-card hover:bg-muted/50'
                          }`}
                        >
                          <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${cat.badgeClass}`}>
                            <CatIcon className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-base font-semibold text-foreground">{cat.label}</span>
                              {isSelected && <Check className="size-4 text-primary" />}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">{cat.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Gambar Sampul (Cover Image) Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-sm space-y-4">
                  <div className="border-b border-border/60 pb-3">
                    <h3 className="font-display text-lg font-bold text-foreground">Gambar Sampul (Cover) *</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Gambar utama untuk thumbnail katalog & header proyek.</p>
                  </div>

                  {projectForm.cover ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                      <img src={projectForm.cover} alt="Cover preview" className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProjectForm(p => ({ ...p, cover: '' }))}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                        title="Hapus sampul"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center aspect-video rounded-xl border border-dashed border-border bg-muted/20 text-center p-4">
                      <ImageIcon className="size-9 text-muted-foreground/50 mb-1" />
                      <span className="text-sm text-muted-foreground">Belum ada gambar sampul</span>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <Input
                      required
                      value={projectForm.cover}
                      onChange={e => setProjectForm(p => ({ ...p, cover: e.target.value }))}
                      placeholder="URL Gambar Sampul..."
                      className="h-12 rounded-xl text-base"
                    />
                    <label className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-secondary text-sm sm:text-base font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors">
                      {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                      Upload Gambar Sampul
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileUpload(e, 'cover')}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Tag & Rekomendasi Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-sm space-y-4">
                  <div className="border-b border-border/60 pb-3">
                    <h3 className="font-display text-lg font-bold text-foreground">Tag & Kata Kunci</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Pisahkan setiap tag dengan tanda koma.</p>
                  </div>

                  <div className="space-y-3">
                    <Input
                      id="p-tags"
                      value={projectForm.tags}
                      onChange={e => setProjectForm(p => ({ ...p, tags: e.target.value }))}
                      placeholder="Mobile App, UI Design, IoT"
                      className="h-12 rounded-xl text-base"
                    />

                    {/* Tag Recommendation Chips */}
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                        Rekomendasi untuk {selectedCategoryConfig.label}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCategoryConfig.suggestedTags.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => addTagSuggestion(tag)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/60 px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                          >
                            <Plus className="size-3.5 text-primary" /> {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Action Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm space-y-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full gap-2 rounded-xl text-base font-semibold shadow-soft-sm"
                  >
                    {loading ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />}
                    {editingItem ? 'Simpan Perubahan' : 'Terbitkan Proyek'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setViewMode('list')}
                    className="h-12 w-full rounded-xl text-base font-medium"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COMPETITIONS & TRAININGS FORM */}
          {(activeTab === 'competitions' || activeTab === 'trainings') && (
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="rounded-2xl border border-border bg-card p-7 shadow-soft-sm space-y-5">
                <div className="border-b border-border/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Detail {activeTab === 'competitions' ? 'Sertifikat Kompetisi' : 'Sertifikat Pelatihan'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Isi data sertifikat dengan informasi lembaga penerbit dan tahun perolehan.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cert-title" className="text-base font-semibold">Nama Penghargaan / Kompetisi / Sertifikasi *</Label>
                    <Input
                      id="cert-title"
                      required
                      value={certForm.title}
                      onChange={e => setCertForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="Contoh: Lomba AI Web Development - Juara 1"
                      className="h-12 rounded-xl text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="cert-issuer" className="text-base font-semibold">Lembaga / Penyelenggara (Penerbit) *</Label>
                      <Input
                        id="cert-issuer"
                        required
                        value={certForm.issuer}
                        onChange={e => setCertForm(p => ({ ...p, issuer: e.target.value }))}
                        placeholder="Contoh: Universitas Airlangga / Dicoding"
                        className="h-12 rounded-xl text-base"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="cert-year" className="text-base font-semibold">Tahun Perolehan *</Label>
                      <Input
                        id="cert-year"
                        type="number"
                        required
                        value={certForm.year}
                        onChange={e => setCertForm(p => ({ ...p, year: parseInt(e.target.value, 10) || 2026 }))}
                        className="h-12 rounded-xl text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cert-cat" className="text-base font-semibold">Label Kategori *</Label>
                    <Input
                      id="cert-cat"
                      required
                      value={certForm.category}
                      onChange={e => setCertForm(p => ({ ...p, category: e.target.value }))}
                      placeholder={activeTab === 'competitions' ? 'Kompetisi' : 'Pelatihan'}
                      className="h-12 rounded-xl text-base"
                    />
                  </div>

                  {/* Certificate Image */}
                  <div className="space-y-3 pt-2">
                    <Label className="text-base font-semibold">Gambar / Scan Sertifikat *</Label>
                    {certForm.img && (
                      <div className="relative max-h-72 overflow-hidden rounded-xl border border-border bg-muted/40 p-2">
                        <img src={certForm.img} alt="Sertifikat preview" className="mx-auto max-h-64 object-contain rounded-lg" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        required
                        value={certForm.img}
                        onChange={e => setCertForm(p => ({ ...p, img: e.target.value }))}
                        placeholder="URL scan gambar sertifikat..."
                        className="h-12 rounded-xl text-base flex-1"
                      />
                      <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary px-5 text-sm sm:text-base font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors shrink-0">
                        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleFileUpload(e, 'img')}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                  <Button type="button" variant="outline" onClick={() => setViewMode('list')} className="rounded-xl h-12 px-5 text-base font-medium">
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading} className="gap-2 rounded-xl h-12 px-6 text-base font-semibold">
                    {loading ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />}
                    Simpan Sertifikat
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ARTICLES FORM */}
          {activeTab === 'articles' && (
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="rounded-2xl border border-border bg-card p-7 shadow-soft-sm space-y-5">
                <div className="border-b border-border/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-foreground">Detail Publikasi Artikel</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Kelola tulisan, catatan kegiatan, dan dokumentasi event.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="art-title" className="text-base font-semibold">Judul Artikel *</Label>
                    <Input
                      id="art-title"
                      required
                      value={articleForm.title}
                      onChange={e => {
                        const val = e.target.value;
                        setArticleForm(p => ({
                          ...p,
                          title: val,
                          id: !editingItem && (!p.id || p.id === generateSlug(p.title)) ? generateSlug(val) : p.id
                        }));
                      }}
                      placeholder="Contoh: SKOMDA Mengajar - AI untuk Pelajar"
                      className="h-12 rounded-xl text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="art-id" className="text-base font-semibold">Slug (ID) *</Label>
                      <Input
                        id="art-id"
                        required
                        disabled={!!editingItem}
                        value={articleForm.id}
                        onChange={e => setArticleForm(p => ({ ...p, id: generateSlug(e.target.value) }))}
                        placeholder="contoh: skomda-mengajar"
                        className="h-12 rounded-xl font-mono text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="art-cat" className="text-base font-semibold">Kategori *</Label>
                      <Input
                        id="art-cat"
                        required
                        value={articleForm.category}
                        onChange={e => setArticleForm(p => ({ ...p, category: e.target.value }))}
                        placeholder="Event / Seminar / Edukasi"
                        className="h-12 rounded-xl text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="art-date" className="text-base font-semibold">Tanggal Pelaksanaan *</Label>
                      <Input
                        id="art-date"
                        type="date"
                        required
                        value={articleForm.date}
                        onChange={e => setArticleForm(p => ({ ...p, date: e.target.value }))}
                        className="h-12 rounded-xl text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="art-tags" className="text-base font-semibold">Tag (pisahkan dengan koma)</Label>
                    <Input
                      id="art-tags"
                      value={articleForm.tags}
                      onChange={e => setArticleForm(p => ({ ...p, tags: e.target.value }))}
                      placeholder="ai, pendidikan, gemini"
                      className="h-12 rounded-xl text-base"
                    />
                  </div>

                  {/* Article Cover */}
                  <div className="space-y-2 pt-1">
                    <Label className="text-base font-semibold">Gambar Sampul Artikel *</Label>
                    {articleForm.cover && (
                      <div className="relative aspect-video max-h-60 overflow-hidden rounded-xl border border-border bg-muted">
                        <img src={articleForm.cover} alt="Cover" className="size-full object-cover" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        required
                        value={articleForm.cover}
                        onChange={e => setArticleForm(p => ({ ...p, cover: e.target.value }))}
                        placeholder="URL gambar sampul..."
                        className="h-12 rounded-xl text-base flex-1"
                      />
                      <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary px-5 text-sm sm:text-base font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors shrink-0">
                        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleFileUpload(e, 'cover')}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="art-desc" className="text-base font-semibold">Deskripsi Singkat (Ringkasan) *</Label>
                    <Textarea
                      id="art-desc"
                      rows={3}
                      required
                      value={articleForm.description}
                      onChange={e => setArticleForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Ringkasan isi artikel dalam 1-2 kalimat..."
                      className="rounded-xl leading-relaxed text-base p-3.5"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="art-content" className="text-base font-semibold">Konten Lengkap Artikel (Markdown) *</Label>
                    <Textarea
                      id="art-content"
                      rows={14}
                      required
                      value={articleForm.content}
                      onChange={e => setArticleForm(p => ({ ...p, content: e.target.value }))}
                      placeholder="Tulis artikel lengkap di sini. Mendukung pemformatan Markdown..."
                      className="font-mono text-base leading-relaxed rounded-xl p-3.5"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                  <Button type="button" variant="outline" onClick={() => setViewMode('list')} className="rounded-xl h-12 px-5 text-base font-medium">
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading} className="gap-2 rounded-xl h-12 px-6 text-base font-semibold">
                    {loading ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />}
                    Simpan Artikel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>

        {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}
      </div>
    );
  }

  // ==========================================
  // RENDER: LIST VIEW (Data Table CMS)
  // ==========================================
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Dashboard */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">Content Management System</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Admin Workspace</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-1">
            Dashboard Konten
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            Kelola karya proyek, sertifikat, dan artikel portofolio secara terpusat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {session?.user?.email && (
            <div className="hidden text-right sm:block">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Masuk sebagai</p>
              <p className="text-base font-semibold text-foreground">{session.user.email}</p>
            </div>
          )}
          <Button variant="outline" onClick={handleLogout} className="gap-2 rounded-xl h-11 px-4 text-sm sm:text-base font-medium">
            <LogOut className="size-4 text-muted-foreground" /> Keluar
          </Button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {TAB_CONFIG.map(t => {
          const Icon = t.icon;
          return (
            <StatCard
              key={t.value}
              icon={Icon}
              label={t.label}
              desc={t.desc}
              count={counts[t.value] ?? '-'}
              active={activeTab === t.value}
              onClick={() => {
                setActiveTab(t.value);
                setSearch('');
                setCategoryFilter('all');
              }}
            />
          );
        })}
      </div>

      {/* Main Table Container Card */}
      <div className="rounded-2xl border border-border bg-card shadow-soft-sm overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between bg-card/60">
          <div className="flex flex-wrap items-center gap-2">
            {TAB_CONFIG.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setActiveTab(t.value);
                    setSearch('');
                    setCategoryFilter('all');
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm sm:text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-soft-xs'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="size-4" />
                  {t.label}
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-primary-foreground/20 text-white' : 'bg-muted-foreground/20'}`}>
                    {counts[t.value] ?? items.length}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari data..."
                className="pl-10 h-11 rounded-xl text-base"
              />
            </div>
            <Button onClick={startCreate} className="gap-2 rounded-xl h-11 px-5 text-sm sm:text-base font-semibold shrink-0 shadow-soft-xs">
              <Plus className="size-5" /> Tambah {TAB_CONFIG.find(t => t.value === activeTab)?.label}
            </Button>
          </div>
        </div>

        {/* Sub-Filter for Projects (Category Filter Chips) */}
        {activeTab === 'projects' && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-muted/20 px-5 py-3 text-sm">
            <span className="font-bold text-muted-foreground mr-1">Filter Bidang:</span>
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-foreground text-background shadow-soft-xs'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Semua ({items.length})
            </button>
            {PROJECT_CATEGORIES.map(c => {
              const count = items.filter(it => it.category === c.id).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryFilter(c.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                    categoryFilter === c.id
                      ? 'bg-primary text-primary-foreground shadow-soft-xs'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c.label} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Data List / Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-border p-4">
                  <div className="size-16 animate-pulse rounded-xl bg-muted shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-14 text-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
                <FileText className="size-7" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">Tidak Ada Data Ditemukan</h3>
              <p className="mt-1.5 text-sm sm:text-base text-muted-foreground max-w-sm">
                {search ? `Tidak ada data yang cocok dengan kata kunci "${search}".` : 'Belum ada data untuk kategori ini. Klik tombol di bawah untuk membuat data baru.'}
              </p>
              {!search && (
                <Button onClick={startCreate} className="mt-5 gap-2 rounded-xl h-11 px-5 text-sm sm:text-base font-semibold">
                  <Plus className="size-5" /> Tambah Baru Sekarang
                </Button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4">Item & Preview</th>
                  <th className="py-4 px-4">Kategori / Bidang</th>
                  <th className="py-4 px-4">Waktu</th>
                  <th className="py-4 px-4">Detail & Tag</th>
                  <th className="py-4 pl-4 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm sm:text-base">
                {filteredItems.map(item => {
                  const imgSrc = item.cover || item.img;
                  const categoryObj = PROJECT_CATEGORIES.find(c => c.id === item.category);

                  return (
                    <tr key={item.id} className="group hover:bg-muted/30 transition-colors">
                      {/* Item & Preview */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3.5">
                          <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                            {imgSrc ? (
                              <img src={imgSrc} alt="" className="size-full object-cover" onError={e => e.target.style.display = 'none'} />
                            ) : (
                              <div className="flex size-full items-center justify-center text-muted-foreground/40">
                                <ImageIcon className="size-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <p className="text-base sm:text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                              {item.title}
                            </p>
                            <p className="font-mono text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                              ID: {item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {activeTab === 'projects' ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold border ${categoryObj?.badgeClass || 'bg-muted text-foreground'}`}>
                            {categoryObj?.label || item.category}
                          </span>
                        ) : (
                          <Badge variant="secondary" className="rounded-md text-xs sm:text-sm font-semibold px-2.5 py-1">
                            {item.issuer || item.category}
                          </Badge>
                        )}
                      </td>

                      {/* Waktu */}
                      <td className="py-4 px-4 whitespace-nowrap text-sm sm:text-base text-muted-foreground font-medium">
                        {activeTab === 'articles' ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            <span>{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        ) : (
                          <span className="font-semibold">{item.year}</span>
                        )}
                      </td>

                      {/* Detail & Tags */}
                      <td className="py-4 px-4 max-w-xs">
                        {Array.isArray(item.tags) && item.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.slice(0, 3).map((tg, i) => (
                              <span key={i} className="rounded-md bg-muted px-2.5 py-1 text-xs sm:text-sm font-medium text-foreground">
                                {tg}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="text-xs font-semibold text-muted-foreground self-center">
                                +{item.tags.length - 3}
                              </span>
                            )}
                          </div>
                        ) : item.description ? (
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                        ) : (
                          <span className="text-sm text-muted-foreground/50">-</span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {activeTab === 'projects' && (
                            <a
                              href={`/projects/${item.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              title="Lihat Pratinjau Web"
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => startEdit(item)}
                            className="h-9 gap-1.5 rounded-xl px-3 text-sm sm:text-base font-semibold hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit2 className="size-4" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setPendingDelete(item.id)}
                            className="h-9 gap-1.5 rounded-xl px-3 text-sm sm:text-base font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" /> Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Floating Notifications & Dialogs */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}
      <ConfirmDialog
        open={!!pendingDelete}
        title="Konfirmasi Hapus Data"
        message={`Apakah Anda yakin ingin menghapus "${pendingDelete}"? Tindakan ini akan menghapus data secara permanen dari basis data.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleting}
      />
    </div>
  );
}