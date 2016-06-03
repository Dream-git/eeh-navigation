'use strict';

angular.module('eehMenu').provider('eehMenu', NavigationProvider);

/**
 * @ngInject
 * @ngdoc service
 * @name eehMenu
 *
 * @description
 * Menus are built using this service.
 *
 * ## Creating Menu Items
 *
 * A menu item is added to a menu by using the service's __menuItem__ method.
 * In the code below "foo" is the name of the menu.
 *
 * ```javascript
 * eehMenuProvider
 * .menuItem('foo.home', {
 *     text: 'Home',
 *     href: '/home'
 * });
 * ```
 *
 * ## Accessing Menu Items in Controllers, Services, and Directives
 *
 * Menu items can be accessed wherever __eehMenu__ is injected - namely in controllers, services, and directives.
 * Menu items are accessed by referencing the menu item name after injecting the **eehMenu** service.
 *
 * ```javascript
 * angular.module('myApp')
 * .controller('MyCtrl', ['eehMenu', function (eehMenu) {
 *     // "foo.home" was defined elsewhere.
 *     eehMenu.menuItem('foo.home').text = 'New Menu Item Text;
 * }]);
 * ```
 *
 * It is possible to create a menu item with the __eehMenu__ service, but it is not recommended.
 * Instead, create the menu item in __.config__ and only do minimal wiring/contextual configuration elsewhere
 * with the __eehMenu__ service.
 *
 * ```javascript
 * // In .config, setup a logout menu item.
 * eehMenuProvider
 * .menuItem('foo.logout', {
 *     text: 'Logout'
 * });
 *
 * // ...
 *
 * // In a controller or service, set the click property of the menu item.
 * eehMenu
 * .menuItem('foo.logout').click = function () {
 *     // Call custom logout code (e.g. destroy a cookie, delete user object, send logout request to server).
 * };
 * ```
 *
 * ## Menu Item Link Actions
 *
 * There are three mutually exclusive, configurable menu item actions:
 * __href__, __click__, and __state__. These actions are available for both navbar and sidebar menu items.
 *
 * ### href
 *
 * A good old fashioned anchor link. This value is plugged into a __ng-href__ attribute behind the scenes.
 *
 * ```javascript
 * eehMenuProvider
 * .menuItem('foo.home', {
 *     text: 'Home',
 *     href: '/home'
 * });
 * ```
 *
 * To make the link open in a new tab, set the __target__ property to '_blank' (the default value is '_self').
 *
 * ```javascript
 * eehMenuProvider
 * .menuItem('foo.home', {
 *     text: 'Home',
 *     href: '/home',
 *     target: '_blank'
 * });
 * ```
 *
 * ### click
 *
 * A parameterless function should be assigned to the click property.
 * This value is plugged into a __ng-click__ attribute behind the scenes.
 *
 * ```javascript
 * eehMenuProvider
 * .menuItem('foo.myMenuItem', {
 *     text: 'My Sidebar Item',
 *     click: function () {}
 * });
 * ```
 *
 * ### state
 *
 * The name of an Angular UI Router state. This value is plugged into an ui-sref attribute behind the scenes.
 *
 * ```javascript
 * $stateProvider
 * .state('myState', {
 *     controller: 'MyCtrl',
 *     templateUrl: 'my-template.html'
 * });
 *
 * // ...
 *
 * eehMenuProvider
 * .menuItem('foo.myMenuItem', {
 *     text: 'My Sidebar Item',
 *     state: 'myState'    // This is a ui-router state.
 * });
 * ```
 *
 * ## Menu Item Ordering
 *
 * Menu items are ordered based on their __weight__.
 *
 * ### weight
 *
 * An integer value. Items that are heavier (i.e. greater weight value) sink to the bottom.
 *
 * ```javascript
 * eehMenuProvider
 * .menuItem('foo.bottomMenuItem', {
 *     text: 'Bottom Sidebar Item',
 *     href: '/bottom-sidebar-item'
 *     weight: 1
 *  })
 * .menuItem('foo.topSidebarMenuItem', {
 *     text: 'Top Sidebar Item',
 *     href: '/top-sidebar-item'
 *     weight: -1
 * });
 * ```
 *
 * ## Menu Item Visibility
 *
 * Menu items are made shown or hidden according to their __isVisible__ property.
 *
 * ### isVisible
 *
 * A boolean value or callback function that returns a boolean value.
 *
 * ```javascript
 * eehMenuProvider
 * .menuItem('myHiddenMenuItem', {
 *     text: 'My Hidden Menu Item',
 *     isVisible: false
 * });
 * ```
 *
 * It is often necessary to contextually hide or show menu items.
 * For example, it is common to hide an "admin" menu item for non-admins.
 * This would probably happen in a controller or service,
 * hence the use of __eehMenu__ instead of __eehMenuProvider__ in the following example.
 *
 * ```javascript
 * var isAdmin = function () {
 *     // We are going to assume user and user.hasRole are defined and that user.hasRole evaluates to a boolean value.
 *     return user.hasRole('admin');
 * };
 * eehMenu
 * .menuItem('admin', {
 *     text: 'Admin',
 *     isVisible: isAdmin
 * });
 * ```
 * ## Menu Item Icons
 *
 * Menu items are decorated with icons based on their __iconClass__.
 *
 * ### iconClass
 *
 * A CSS class that corresponds to an icon in a library like
 * [Glyphicons](http://getbootstrap.com/components/#glyphicons) or
 * [Font Awesome](http://fortawesome.github.io/Font-Awesome/icons/).
 *
 * ```javascript
 * eehMenuProvider
 * .menuItem('foo.home', {
 *     text: 'Home',
 *     href: '/home'
 *     iconClass: 'glyphicon-home'
 * });
 * ```
 *
 * Glyphicons are supported by default.
 * To use another library, like Font Awesome, the base icon class needs to be set.
 * For example, "fa" is the base icon class of font awesome.
 *
 * ```javascript
 * eehMenuProvider.iconBaseClass('fa');
 * ```
 *
 * Certain directives might use the defaultIconClassPrefix property, if the directive has default icons
 * (e.g. the chevrons in the sidebar directive), to specify an icon library's class prefix.
 * For example, the prefix for Font Awesome is the same as the base class.
 *
 * ```javascript
 * eehMenuProvider.defaultIconClassPrefix('fa');
 * ```
 *
 * ## Language Translation
 *
 * This doc provides an example of how to use [angular-translate](http://angular-translate.github.io/) to translate menu item text.
 *
 * Internally, all menu item names are passed through the angular-translate module's _translate_ filter.
 * If you do not include __angular-translate__ or do not specify translations, then the menu item's text will be displayed normally.
 *
 * ### Add Menu Items to Translate
 *
 * ```
 * angular.module('myApp').config(['$translateProvider', 'eehMenuProvider',
 * function ($translateProvider, eehMenuProvider) {
 *     eehMenuProvider
 *         .menuItem('home', {
 *             text: 'Home',   // Will be translated.
 *             href: '/home',
 *         })
 *         .menuItem('logout', {
 *             text: 'Logout', // Will be translated.
 *             href: '/logout',
 *         });
 * }]);
 * ```
 *
 * ### Add Translations
 *
 * ```
 * angular.module('myApp').config(['$translateProvider', 'eehMenuProvider',
 * function ($translateProvider, eehMenuProvider) {
 *     // ...
 *
 *     // English translation
 *     $translateProvider
 *         .translations('en', {
 *             'Home': 'Home',
 *             'Logout': 'Logout'
 *         });
 *
 *     // German translation
 *     $translateProvider
 *         .translations('de', {
 *             'Home': 'Zuhause',
 *             'Logout': 'Abmelden'
 *         });
 * }]);
 * ```
 *
 * ### Add Nested Menu Items to Toggle Between Languages
 *
 * ```
 * angular.module('myApp').config(['$translateProvider', 'eehMenuProvider',
 * function ($translateProvider, eehMenuProvider) {
 *     // ...
 *
 *     // Switch languages via dropdown
 *     eehMenuProvider
 *         .menuItem('language', {
 *             text: 'Language'
 *         })
 *         .menuItem('language.en', {
 *             text: 'English',
 *             click: function () {
 *                 $translateProvider.use('en');
 *             }
 *         })
 *         .menuItem('language.de', {
 *             text: 'Deutsch',
 *             click: function () {
 *                 $translateProvider.use('de');
 *             }
 *         });
 * }]);
 * ```
 *
 * ## Nested Menu Items
 *
 * Menu items can be nested by using a __.__ in the first parameter of menuItem.
 * The below example illustrates how to nest child menu items under parent menu items.
 *
 * If a menu item has children, do not assign a menu item action (i.e. href, click, or state) to it.
 * Menu item actions for parent menu items have not been implemented.
 *
 * There is theoretically no limit to the level of nesting that the __eehMenu__ service supports.
 * The various menu directives provided by this module may have limits to what they can adequately display.
 *
 * ```
 * eehMenuProvider
 *     .menuItem('menu.root', { // The root level of the nested menu.
 *         text: 'Root'
 *     })
 *     .menuItem('menu.root.foo', { // The first item under root.
 *         text: 'Foo',
 *         href: '/some/path'
 *     })
 *     .menuItem('menu.root.bar', { // The second item under root.
 *         text: 'Bar',
 *         href: '/some/path'
 *     })
 *     .menuItem('menu.root.baz', { // The third item under root.
 *         text: 'Baz'
 *     })
 *     .menuItem('menu.root.baz.qux', { // The first item under root.baz
 *         text: 'Quz',
 *         href: '/some/path'
 *     })
 *     .menuItem('menu.root.baz.quux', { // The second item under root.baz
 *         text: 'Quux',
 *         href: '/some/path'
 *     });
 * ```
 *
 * ### isCollapsed
 *
 * A boolean value. Configure the collapse state of a parent menu item.
 * Each parent in a nested hierarchy has an independent collapse state.
 *
 * ```
 * eehMenuProvider
 *     .menuItem('menu.root', {
 *         text: 'Root',
 *         isCollapsed: true
 *     })
 *     .menuItem('menu.root.foo', {
 *         text: 'Foo',
 *         href: '/some/path'
 *     });
 * ```
 */
function NavigationProvider() {
    this._iconBaseClass = 'glyphicon';
    this._defaultIconClassPrefix = 'glyphicon';
    this._menuItems = {};
}

NavigationProvider.prototype.iconBaseClass = function (value) {
    if (angular.isUndefined(value)) {
        return this._iconBaseClass;
    }
    this._iconBaseClass = value;
    return this;
};

NavigationProvider.prototype.defaultIconClassPrefix = function (value) {
    if (angular.isUndefined(value)) {
        return this._defaultIconClassPrefix;
    }
    this._defaultIconClassPrefix = value;
    return this;
};

NavigationProvider.prototype.menuItem = function (name, config) {
    this._menuItems[name] = config;
    return this;
};

/** @ngInject */
NavigationProvider.prototype.$get = function (menuJsMenu) {
    return new NavigationService(menuJsMenu, this._menuItems, this._iconBaseClass, this._defaultIconClassPrefix);
};

function NavigationService(menu, menuItems, iconBaseClass, defaultIconClassPrefix) {
    this._menu = menu;
    this._iconBaseClass = iconBaseClass;
    this.defaultIconClassPrefix = defaultIconClassPrefix;
    var self = this;

    this.menuItems = function () {
        return self._menu._menuItems;
    };

    angular.forEach(menuItems, function (menuItem, menuItemName) {
        self.menuItem(menuItemName, menuItem);
    });
}

NavigationService.prototype.iconBaseClass = function () {
    return this._iconBaseClass;
};

NavigationService.prototype.defaultIconClassPrefix = function () {
    return this._defaultIconClassPrefix;
};

NavigationService.prototype.menuItemTree = function (menuName) {
    return this._menu.menuItemTree(menuName);
};

NavigationService.prototype.menuItem = function (name, config) {
    if (angular.isUndefined(config)) {
        return this._menu.menuItem(name);
    }
    if (angular.isUndefined(config.isVisible)) {
        config.isVisible = function () {
            return this.hasVisibleChildren() ||
              (angular.isDefined(this.state) ||
              angular.isDefined(this.href) ||
              angular.isDefined(this.click) ||
              this.isDivider);
        };
    }
    this._menu.menuItem(name, config);
    return this;
};