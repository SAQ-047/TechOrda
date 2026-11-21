import { useState } from 'react';

export default function useFavorites() {
  const [ids, setIds] = useState([]);

  function toggle(id) {
    setIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds.filter((currentId) => currentId !== id);
      }

      return [...currentIds, id];
    });
  }

  function clear() {
    setIds([]);
  }

  return { ids, toggle, clear };
}
