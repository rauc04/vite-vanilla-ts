import './style.scss';
type MenuHTMLElement = {
  show: (element: MenuHTMLElement) => void;
  hide: (element: MenuHTMLElement) => void
} & HTMLElement;

type ContextType = Document | MenuHTMLElement;

const queryList = (
	selector: keyof HTMLElementTagNameMap | string,
	context: ContextType = document
) => {
	return context.querySelectorAll(selector) as NodeListOf<MenuHTMLElement>;
};

const forEachElement = (
	nodeList: NodeListOf<MenuHTMLElement>,
	fun: (element: MenuHTMLElement) => void
) => {
  Object.keys(nodeList).forEach(key => {
    const element: MenuHTMLElement = nodeList[key as any];
		fun(element);
  });
};

const show = (menu: ContextType) => {
	const uListElement = queryList('ul', menu)[0];
	if (!uListElement || uListElement.classList.contains('kaa-main-nav__list--visible')) return;

	(menu as MenuHTMLElement).classList.add('kaa-main-nav__item--active');
	uListElement.classList.add('kaa-main-nav__list--animating');
	uListElement.classList.add('kaa-main-nav__list--visible');
	setTimeout(() => {
		uListElement.classList.remove('kaa-main-nav__list--animating');
	}, 25);
};

const hide = (menu: ContextType) => {
	const uListElement = queryList('ul', menu)[0];

	if (!uListElement || !uListElement.classList.contains('kaa-main-nav__list--visible')) return;

	(menu as MenuHTMLElement).classList.remove('kaa-main-nav__item--active');
	uListElement.classList.add('kaa-main-nav__list--animating');
	setTimeout(() => {
		uListElement.classList.remove('kaa-main-nav__list--visible');
		uListElement.classList.remove('kaa-main-nav__list--animating');
	}, 300);
};

const hideAllMenu = () => {
	const elementNotHover = queryList(
		'.kaa-main-nav__item.kaa-main-nav__item--submenu.kaa-main-nav__item--active:not(:hover)'
	);
	forEachElement(elementNotHover, (element) => element?.hide(element));
};

document.addEventListener('DOMContentLoaded', () => {
	const parent = queryList(
		'.kaa-main-nav__list .kaa-main-nav__item.kaa-main-nav__item--submenu'
	);
	forEachElement(parent, (element) => {
		element.show = show;
		element.hide = hide;
	});

	const parentItems = queryList(
		'.kaa-main-nav__list > .kaa-main-nav__item.kaa-main-nav__item--submenu'
	);
	forEachElement(parentItems, (element) => {
		element.addEventListener('click', () => show(element));
	});

	const submenuItems = queryList(
		'.kaa-main-nav__list > .kaa-main-nav__item.kaa-main-nav__item--submenu .kaa-main-nav__item'
	);
	forEachElement(submenuItems, (element) => {
		element.addEventListener('mouseenter', hideAllMenu);
	});

	const _submenuItems = queryList(
		'.kaa-main-nav__list > .kaa-main-nav__item.kaa-main-nav__item--submenu .kaa-main-nav__item.kaa-main-nav__item--submenu'
	);
	forEachElement(_submenuItems, (element) => {
		element.addEventListener('mouseenter', () => show(element));
	});

	document.addEventListener('click', hideAllMenu);
});
