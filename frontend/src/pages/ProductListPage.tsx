import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Product, ProductListResponse } from '../types';
import ProductCard from '../components/ProductCard';
import styles, { tagBtnStyle, pageBtnStyle } from './ProductListPage.styles';

const TAGS = ['전체', '팝니다', '삽니다', '나눕니다', '같이삽시다'];

export default function ProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [tag, setTag] = useState('전체');
  const [showDone, setShowDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('search', search);
      if (tag !== '전체') params.set('tag', tag);
      if (showDone) params.set('showDone', 'true');
      const data = await api.get<ProductListResponse>(`/api/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, search, tag, showDone]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function handleSearch() { setSearch(searchInput); setPage(1); }
  function handleTagChange(t: string) { setTag(t); setPage(1); }

  return (
    <div style={styles.page}>
      <div style={styles.searchRow}>
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="제목 또는 닉네임으로 검색"
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchBtn}>검색</button>
      </div>

      <div style={styles.filterRow}>
        {TAGS.map(t => (
          <button key={t} onClick={() => handleTagChange(t)} style={tagBtnStyle(tag === t)}>{t}</button>
        ))}
        <label style={styles.showDoneLabel}>
          <input
            type="checkbox"
            checked={showDone}
            onChange={e => { setShowDone(e.target.checked); setPage(1); }}
            style={styles.showDoneCheckbox}
          />
          완료 상품 보기
        </label>
        <button onClick={() => navigate('/products/new')} style={styles.addBtn}>+ 상품 등록</button>
      </div>

      <p style={styles.countText}>총 {total}개의 상품</p>

      {loading ? (
        <div style={styles.loadingBox}>로딩 중...</div>
      ) : products.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>🛒</div>
          <p>아직 등록된 상품이 없어요!</p>
          <button onClick={() => navigate('/products/new')} style={styles.emptyBtn}>
            첫 상품 등록하기
          </button>
        </div>
      ) : (
        <div style={styles.card}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div style={styles.paginationRow}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={pageBtnStyle(page === p)}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
