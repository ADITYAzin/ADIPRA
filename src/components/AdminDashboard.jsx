import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleSignInButton } from './GoogleSignInButton';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Plus, Edit2, Trash2, LogOut, Upload, Loader2, X, Search, ImagePlus, Check, AlertCircle, Eye, EyeOff, LayoutDashboard, FileText, Award, BookOpen, FolderKanban } from 'lucide-react';

const TAB_CONFIG = [
  { value: 'projects', label: 'Proyek', icon: FolderKanban },
  { value: 'competitions', label: 'Kompetisi', icon: Award },
  { value: 'trainings', label: 'Pelatihan', icon: BookOpen },
  { value: 'articles', label: 'Artikel', icon: FileText },
];

const INITIAL_FORM = {
  id: '', title: '', category: '', year: new Date().getFullYear(),
  tags: '', cover: '', description: '', detail: '', gallery: '',
  img: '', issuer: '', date: new Date().toISOString().split('T')[0], content: '',
};

function Toast({ type, message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const bg = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
  const Icon = type === 'success' ? Check : AlertCircle;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl ${bg} px-5 py-3.5 text-white shadow-soft-lg animate-in slide-in-from-bottom-4 fade-in duration-300`}>
      <Icon className="size-4 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 rounded-full p-1 hover:bg-white/20 transition-colors"><X className="size-3.5" /></button>
    </div>
  );
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-card bg-card p-6 shadow-soft-lg" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>Batal</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Hapus'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ImagePreview({ src, alt }) {
  if (!src) return null;
  return (
    <div className="mt-2 flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/30">
      <img src={src} alt={alt || 'preview'} className="h-auto max-h-64 w-auto max-w-full object-contain" onError={e => e.target.style.display = 'none'} />
    </div>
  );
}

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-2xl bg-muted ${className}`} />;
}

function StatCard({ icon: Icon, label, count }) {
  return (
    <div className="flex items-center gap-4 rounded-card bg-card p-5 shadow-soft-md">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary">
        <Icon className="size-5 text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold tracking-tight">{count}</p>
      </div>
    </div>
  );
}

function ItemCard({ item, tab, onEdit, onDelete }) {
  const imgSrc = item.cover || item.img;
  const titleField = item.title;
  const metaField = tab === 'articles' ? item.date : item.year;
  const metaLabel = tab === 'articles' ? new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }) : item.year;
  const categoryLabel = item.category;
  const issuerLabel = item.issuer;

  return (
    <div className="group flex items-center gap-4 rounded-card bg-card p-4 shadow-soft-md transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
      {imgSrc && (
        <div className="size-14 shrink-0 overflow-hidden rounded-2xl bg-muted">
          <img src={imgSrc} alt="" className="size-full object-cover" onError={e => e.target.style.display = 'none'} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm">{titleField}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-[11px]">{categoryLabel}</Badge>
          <span>{metaLabel}</span>
          {issuerLabel && <span className="truncate">{issuerLabel}</span>}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button variant="ghost" size="icon-xs" onClick={() => onEdit(item)} aria-label="Edit">
          <Edit2 className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" className="text-destructive hover:text-destructive" onClick={() => onDelete(item.id)} aria-label="Hapus">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
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
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [counts, setCounts] = useState({});

  const [formFields, setFormFields] = useState({ ...INITIAL_FORM });

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
    if (session) fetchItems();
  }, [session, activeTab]);

  useEffect(() => {
    if (!session || !supabase) return;
    const fetchCounts = async () => {
      const result = {};
      for (const t of TAB_CONFIG) {
        const { count, error } = await supabase.from(t.value).select('id', { count: 'exact', head: true });
        if (!error) result[t.value] = count ?? 0;
      }
      setCounts(result);
    };
    fetchCounts();
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setAuthError('Email dan password harus diisi.'); return; }
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

  const fetchItems = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from(activeTab).select('*').order('created_at', { ascending: false });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${activeTab}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
    if (uploadError) {
      showToast('error', 'Gagal upload: ' + uploadError.message);
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);
    if (field === 'gallery') {
      const current = formFields.gallery ? formFields.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];
      setFormFields(prev => ({ ...prev, gallery: [...current, publicUrl].join(', ') }));
    } else {
      setFormFields(prev => ({ ...prev, [field]: publicUrl }));
    }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    const payload = { ...formFields };
    if (activeTab === 'projects' || activeTab === 'articles') {
      payload.tags = formFields.tags ? formFields.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    }
    if (activeTab === 'projects') {
      payload.gallery = formFields.gallery ? formFields.gallery.split(',').map(g => g.trim()).filter(Boolean) : [];
    }
    const cleanPayload = {};
    if (activeTab === 'projects') {
      ['id', 'title', 'category', 'year', 'tags', 'cover', 'description', 'detail', 'gallery'].forEach(k => cleanPayload[k] = payload[k]);
    } else if (activeTab === 'competitions' || activeTab === 'trainings') {
      ['id', 'title', 'issuer', 'year', 'category', 'img'].forEach(k => cleanPayload[k] = payload[k]);
    } else if (activeTab === 'articles') {
      ['id', 'title', 'description', 'date', 'category', 'tags', 'cover', 'content'].forEach(k => cleanPayload[k] = payload[k]);
    }
    let error;
    if (editingItem) {
      const { error: err } = await supabase.from(activeTab).update(cleanPayload).eq('id', editingItem.id);
      error = err;
    } else {
      const { error: err } = await supabase.from(activeTab).insert([cleanPayload]);
      error = err;
    }
    setLoading(false);
    if (error) {
      showToast('error', 'Gagal menyimpan: ' + error.message);
    } else {
      showToast('success', editingItem ? 'Berhasil diperbarui.' : 'Berhasil ditambahkan.');
      setShowForm(false);
      setEditingItem(null);
      fetchItems();
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormFields({
      id: item.id || '',
      title: item.title || '',
      category: item.category || '',
      year: item.year || new Date().getFullYear(),
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      cover: item.cover || '',
      description: item.description || '',
      detail: item.detail || '',
      gallery: Array.isArray(item.gallery) ? item.gallery.join(', ') : item.gallery || '',
      img: item.img || '',
      issuer: item.issuer || '',
      date: item.date || new Date().toISOString().split('T')[0],
      content: item.content || ''
    });
    setShowForm(true);
  };

  const startNew = () => {
    setEditingItem(null);
    setFormFields({ ...INITIAL_FORM, year: new Date().getFullYear(), date: new Date().toISOString().split('T')[0] });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const { error } = await supabase.from(activeTab).delete().eq('id', pendingDelete);
    setDeleting(false);
    if (error) {
      showToast('error', 'Gagal menghapus: ' + error.message);
    } else {
      showToast('success', 'Berhasil dihapus.');
      fetchItems();
    }
    setPendingDelete(null);
  };

  const filteredItems = items.filter(item =>
    !search || (item.title && item.title.toLowerCase().includes(search.toLowerCase()))
  );

  if (authLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto mt-16 max-w-sm">
        <div className="rounded-card bg-card p-8 shadow-soft-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <LayoutDashboard className="size-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Masuk untuk mengelola konten</p>
          </div>
          {authError && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="size-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1} aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}>
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? <Loader2 className="size-4 animate-spin" /> : 'Masuk'}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">atau</span></div>
            </div>
            <GoogleSignInButton />
          </form>
        </div>
      </div>
    );
  }

  const currentTab = TAB_CONFIG.find(t => t.value === activeTab) || TAB_CONFIG[0];
  const TabIcon = currentTab.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Kelola konten portofolio</p>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.email && (
            <span className="hidden text-sm text-muted-foreground sm:block">{session.user.email}</span>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="size-4" /> Keluar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {TAB_CONFIG.map(t => {
          const Icon = t.icon;
          return (
            <StatCard
              key={t.value}
              icon={Icon}
              label={t.label}
              count={counts[t.value] ?? '-'}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {TAB_CONFIG.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => { setActiveTab(t.value); setShowForm(false); setSearch(''); }}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                isActive ? 'bg-primary text-primary-foreground shadow-soft-sm' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="size-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari berdasarkan judul..."
            className="pl-9"
          />
        </div>
        <Button onClick={startNew} className="gap-2 shrink-0">
          <Plus className="size-4" /> Tambah Baru
        </Button>
      </div>

      {showForm && (
        <div className="admin-edit-surface fixed inset-0 z-40 min-h-screen w-full overflow-y-auto bg-background" data-lenis-prevent-wheel data-lenis-prevent-touch onClick={() => setShowForm(false)}>
          <style>{`
            .admin-edit-surface input,
            .admin-edit-surface textarea {
              background-color: #ffffff !important;
              color: #1f2937 !important;
              border-color: #d1d5db !important;
            }
            .admin-edit-surface label {
              color: #111827 !important;
            }
          `}</style>
          <div onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4 sm:px-8">
              <div>
                <h2 className="font-display text-xl font-semibold">
                  {editingItem ? 'Edit' : 'Tambah'} {currentTab.label}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {currentTab.label} — isi semua kolom lalu simpan
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} aria-label="Tutup">
                <X className="size-5" />
              </Button>
            </div>
            <form onSubmit={handleSave} className="mx-auto max-w-5xl space-y-6 p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="slide-id">ID (slug)</Label>
                  <Input id="slide-id" disabled={!!editingItem} value={formFields.id} onChange={e => setFormFields(p => ({ ...p, id: e.target.value }))} placeholder="contoh: judul-artikel" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slide-title">Judul</Label>
                  <Input id="slide-title" value={formFields.title} onChange={e => setFormFields(p => ({ ...p, title: e.target.value }))} placeholder="Judul" required />
                </div>
              </div>

              {activeTab === 'projects' && (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="slide-cat">Kategori</Label>
                      <Input id="slide-cat" value={formFields.category} onChange={e => setFormFields(p => ({ ...p, category: e.target.value }))} placeholder="uiux, webdev, brand" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="slide-year">Tahun</Label>
                      <Input id="slide-year" type="number" value={formFields.year} onChange={e => setFormFields(p => ({ ...p, year: parseInt(e.target.value) || 2026 }))} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="slide-tags">Tag (koma)</Label>
                      <Input id="slide-tags" value={formFields.tags} onChange={e => setFormFields(p => ({ ...p, tags: e.target.value }))} placeholder="Mobile App, UI Design" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Gambar Sampul</Label>
                    <div className="flex gap-2">
                      <Input value={formFields.cover} onChange={e => setFormFields(p => ({ ...p, cover: e.target.value }))} placeholder="URL gambar" className="flex-1" required />
                      <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
                        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'cover')} disabled={uploading} />
                      </label>
                    </div>
                    <ImagePreview src={formFields.cover} alt="Cover" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slide-desc">Deskripsi Singkat</Label>
                    <Textarea id="slide-desc" rows={3} value={formFields.description} onChange={e => setFormFields(p => ({ ...p, description: e.target.value }))} placeholder="Intro singkat proyek..." required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slide-detail">Deskripsi Detail (Markdown)</Label>
                    <Textarea id="slide-detail" rows={8} value={formFields.detail} onChange={e => setFormFields(p => ({ ...p, detail: e.target.value }))} placeholder="Tulis detail proyek..." required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Galeri Gambar</Label>
                    <div className="flex gap-2">
                      <Input value={formFields.gallery} onChange={e => setFormFields(p => ({ ...p, gallery: e.target.value }))} placeholder="URL gambar (pisahkan dengan koma)" className="flex-1" />
                      <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
                        <ImagePlus className="size-4" /> Tambah
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'gallery')} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {(activeTab === 'competitions' || activeTab === 'trainings') && (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="slide-issuer">Penerbit</Label>
                      <Input id="slide-issuer" value={formFields.issuer} onChange={e => setFormFields(p => ({ ...p, issuer: e.target.value }))} placeholder="Universitas Airlangga" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="slide-year2">Tahun</Label>
                      <Input id="slide-year2" type="number" value={formFields.year} onChange={e => setFormFields(p => ({ ...p, year: parseInt(e.target.value) || 2026 }))} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="slide-cat2">Kategori</Label>
                      <Input id="slide-cat2" value={formFields.category} onChange={e => setFormFields(p => ({ ...p, category: e.target.value }))} placeholder="Kompetisi / Pelatihan" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Gambar Sertifikat</Label>
                    <div className="flex gap-2">
                      <Input value={formFields.img} onChange={e => setFormFields(p => ({ ...p, img: e.target.value }))} placeholder="URL gambar" className="flex-1" required />
                      <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
                        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'img')} disabled={uploading} />
                      </label>
                    </div>
                    <ImagePreview src={formFields.img} alt="Sertifikat" />
                  </div>
                </>
              )}

              {activeTab === 'articles' && (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="slide-cat3">Kategori</Label>
                      <Input id="slide-cat3" value={formFields.category} onChange={e => setFormFields(p => ({ ...p, category: e.target.value }))} placeholder="Event, Seminar, Kompetisi" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="slide-date">Tanggal</Label>
                      <Input id="slide-date" type="date" value={formFields.date} onChange={e => setFormFields(p => ({ ...p, date: e.target.value }))} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="slide-tags2">Tag (koma)</Label>
                      <Input id="slide-tags2" value={formFields.tags} onChange={e => setFormFields(p => ({ ...p, tags: e.target.value }))} placeholder="ai, pendidikan" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Gambar Sampul</Label>
                    <div className="flex gap-2">
                      <Input value={formFields.cover} onChange={e => setFormFields(p => ({ ...p, cover: e.target.value }))} placeholder="URL gambar" className="flex-1" required />
                      <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
                        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'cover')} disabled={uploading} />
                      </label>
                    </div>
                    <ImagePreview src={formFields.cover} alt="Cover" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slide-desc3">Deskripsi Singkat</Label>
                    <Textarea id="slide-desc3" rows={3} value={formFields.description} onChange={e => setFormFields(p => ({ ...p, description: e.target.value }))} placeholder="Intro singkat artikel..." required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slide-content">Artikel / Body (Markdown)</Label>
                    <Textarea id="slide-content" rows={24} value={formFields.content} onChange={e => setFormFields(p => ({ ...p, content: e.target.value }))} placeholder="Tulis isi artikel panjang (free text) di sini, mendukung Markdown..." required />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-border p-6 sm:p-8">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : 'Simpan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-card bg-card p-4 shadow-soft-md">
              <Skeleton className="size-14 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-2/5" />
              </div>
            </div>
          ))
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-card bg-card p-12 shadow-soft-md">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-muted-foreground">
              {search ? 'Tidak ada hasil untuk pencarian.' : 'Belum ada data.'}
            </p>
            {!search && (
              <Button variant="outline" size="sm" onClick={startNew} className="mt-4 gap-2">
                <Plus className="size-4" /> Tambah {currentTab.label.slice(0, -1)}
              </Button>
            )}
          </div>
        ) : (
          filteredItems.map(item => (
            <ItemCard key={item.id} item={item} tab={activeTab} onEdit={startEdit} onDelete={id => setPendingDelete(id)} />
          ))
        )}
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}
      <ConfirmDialog
        open={!!pendingDelete}
        title="Hapus Data"
        message={`Apakah kamu yakin ingin menghapus item ini? Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleting}
      />
    </div>
  );
}