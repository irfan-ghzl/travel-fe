import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toursApi } from '../api';
import type { TourPackage, Pagination } from '../types';
import TourCard from '../components/TourCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'beach', label: 'Beach' },
  { value: 'city', label: 'City' },
  { value: 'nature', label: 'Nature' },
  { value: 'religious', label: 'Religious' },
  { value: 'honeymoon', label: 'Honeymoon' },
  { value: 'family', label: 'Family' },
];

export default function Tours() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const res = await toursApi.list({
        page,
        limit: 9,
        search: search || undefined,
        category: category || undefined,
        min_price: minPrice ? Number(minPrice) : undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
        destination_id: searchParams.get('destination_id')
          ? Number(searchParams.get('destination_id'))
          : undefined,
      });
      setTours(res.data);
      setPagination(res.pagination);
    } catch {
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, minPrice, maxPrice, searchParams]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    const destId = searchParams.get('destination_id');
    if (destId) params.destination_id = destId;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    setSearchParams({});
  };

  const goToPage = (p: number) => {
    setPage(p);
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = search || category || minPrice || maxPrice;

  return (
    <div className="tours-page">
      <div className="tours-header">
        <div className="container">
          <h1>Explore Tours</h1>
          <p>Find your perfect travel experience</p>
        </div>
      </div>

      <div className="container">
        <div className="tours-layout">
          {/* Mobile filter toggle */}
          <button
            className="btn btn-outline filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          {/* Sidebar Filters */}
          <aside className={`tours-sidebar ${showFilters ? 'active' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className="btn-text" onClick={handleClearFilters}>
                  <X size={16} /> Clear All
                </button>
              )}
            </div>
            <form className="filters-form" onSubmit={handleApplyFilters}>
              <div className="filter-group">
                <label>Search</label>
                <div className="search-input-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search tours..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-range-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Apply Filters
              </button>
            </form>
          </aside>

          {/* Tour List */}
          <div className="tours-content">
            {loading ? (
              <LoadingSpinner message="Loading tours..." />
            ) : tours.length > 0 ? (
              <>
                <div className="tours-count">
                  Showing {tours.length} of {pagination?.total || 0} tours
                </div>
                <div className="tours-grid">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={page <= 1}
                      onClick={() => goToPage(page - 1)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === pagination.total_pages ||
                          Math.abs(p - page) <= 2
                      )
                      .map((p, idx, arr) => {
                        const prev = arr[idx - 1];
                        const showEllipsis = prev !== undefined && p - prev > 1;
                        return (
                          <span key={p}>
                            {showEllipsis && <span className="pagination-ellipsis">...</span>}
                            <button
                              className={`pagination-btn ${p === page ? 'active' : ''}`}
                              onClick={() => goToPage(p)}
                            >
                              {p}
                            </button>
                          </span>
                        );
                      })}
                    <button
                      className="pagination-btn"
                      disabled={page >= pagination.total_pages}
                      onClick={() => goToPage(page + 1)}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <h3>No tours found</h3>
                <p>Try adjusting your filters or search terms.</p>
                {hasActiveFilters && (
                  <button className="btn btn-outline" onClick={handleClearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
