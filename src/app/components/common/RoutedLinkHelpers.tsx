import { NavLink, ListGroupItem, NavbarBrand } from "reactstrap";

export class RoutedNavLink extends NavLink< { to: string }> {};
export class RoutedNavbarBrand extends NavbarBrand< { to?: string }> {};
export class RoutedListGroupItem extends ListGroupItem< { to: string }> {};