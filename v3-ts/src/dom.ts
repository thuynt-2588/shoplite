// DOM utilities
export function mustQuery<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Không tìm thấy phần tử "${selector}" trong trang.`);
  return element;
}

export function eventTargetElement(event: Event): Element | null {
  return event.target instanceof Element ? event.target : null;
}
