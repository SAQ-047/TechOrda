import { useEffect, useRef, useState } from 'react';

let activeObservers = 0;

function Child({ title }) {
  const nodeRef = useRef(null);
  console.log('[render] Child: title =', title);

  useEffect(() => {
    const node = nodeRef.current;
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        console.log('[DOM] Child:', {
          type: record.type,
          oldValue: record.oldValue,
          text: node.textContent,
        });
      }
    });
    observer.observe(node, {
      childList: true,
      characterData: true,
      characterDataOldValue: true,
      subtree: true,
    });
    activeObservers += 1;
    console.log('[observer] setup; active =', activeObservers);

    return () => {
      observer.disconnect();
      activeObservers -= 1;
      console.log('[observer] cleanup; active =', activeObservers);
    };
  }, []);

  return (
    <section ref={nodeRef} aria-label="Наблюдаемый ребёнок">
      <h2>{title}</h2>
      <p>Постоянный текст ребёнка.</p>
    </section>
  );
}

export default function App() {
  const [count, setCount] = useState(0);
  const [alternateTitle, setAlternateTitle] = useState(false);
  const [generation, setGeneration] = useState(0);

  return (
    <main>
      <h1>01. Render и commit</h1>
      <p>Откройте DevTools → Console и сравните логи [render], [DOM] и [observer].</p>
      <p>Счётчик родителя: <output>{count}</output></p>
      <div className="actions">
        <button onClick={() => setCount((value) => value + 1)}>Увеличить счётчик</button>
        <button onClick={() => setAlternateTitle((value) => !value)}>Изменить title</button>
        <button onClick={() => setGeneration((value) => value + 1)}>Перемонтировать ребёнка</button>
      </div>
      <Child key={generation} title={alternateTitle ? 'Новый заголовок' : 'Исходный заголовок'} />
      <p>При изменении счётчика ребёнок вычисляется снова; его DOM остаётся прежним.</p>
      <p>При изменении title обновляется заголовок ребёнка. Постоянный текст сохраняется.</p>
      <p>В dev-режиме StrictMode дополнительно вызывает render и проверяет очистку эффекта.</p>
    </main>
  );
}
