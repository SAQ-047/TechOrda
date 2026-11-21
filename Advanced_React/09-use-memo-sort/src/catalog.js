import courses from './courses.json';

const collator = new Intl.Collator('ru');

export const catalog = Array.from({ length: 2000 }, (_, index) => {
  const course = courses[index % courses.length];
  const number = String(index + 1).padStart(4, '0');

  return {
    ...course,
    id: `${course.id}-${number}`,
    title: `${course.title} ${number}`,
  };
});

export function sortCourses(items, direction) {
  const order = direction === 'asc' ? 1 : -1;
  return items.toSorted((first, second) => order * collator.compare(first.title, second.title));
}
