export default function CourseFilters({ query, category, onQueryChange, onCategoryChange, onReset }) {
  return (
    <fieldset>
      <legend>Фильтры каталога</legend>
      <div className="filter-fields">
        <label>
          Поиск по названию
          <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} />
        </label>
        <label>
          Категория
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            <option value="">Все категории</option>
            <option value="frontend">frontend</option>
            <option value="fullstack">fullstack</option>
            <option value="quality">quality</option>
          </select>
        </label>
        <button type="button" onClick={onReset}>Сбросить фильтры</button>
      </div>
    </fieldset>
  );
}
