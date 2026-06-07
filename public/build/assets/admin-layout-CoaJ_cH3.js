import{j as a,$ as n,K as d,r as c,d as t}from"./app-CcHqV1n2.js";import{L as h,B as m,S as p,d as l,e as u,f as v,g as b,A as f,h as x,N as j,i as k,j as y,k as M,l as S,m as g,n as N}from"./app-sidebar-header-DJ1PXwWw.js";import{c as o,u as C}from"./index-Dg4nuHo9.js";import{S as i}from"./use-initials-Z39v3QV2.js";import{P as A}from"./package-xaIkRxJA.js";import{P as _}from"./pencil-sdFqhIin.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],P=o("ChartColumn",L);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"qn84l0"}],["path",{d:"M13 5v2",key:"dyzc3o"}],["path",{d:"M13 17v2",key:"1ont0d"}],["path",{d:"M13 11v2",key:"1wjjxi"}]],B=o("Ticket",U);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]],I=o("Users",H);function $(){const{t:s}=C(),r=[{title:s("dashboard.nav.adminDashboard"),href:"/admin/dashboard",icon:h},{title:s("dashboard.nav.adminOrders"),href:"/admin/orders",icon:i},{title:s("dashboard.nav.adminProducts"),href:"/admin/products",icon:A},{title:s("dashboard.nav.adminUsers"),href:"/admin/users",icon:I},{title:s("dashboard.nav.adminCoupons"),href:"/admin/coupons",icon:B},{title:s("dashboard.nav.adminBlogs"),href:"/admin/blogs",icon:_},{title:s("dashboard.nav.adminReports"),href:"/admin/reports",icon:P}],e=[{title:s("dashboard.nav.viewStore"),href:"/",icon:i},{title:s("dashboard.nav.documentation"),href:"https://laravel.com/docs/starter-kits#react",icon:m}];return a.jsxs(p,{collapsible:"icon",variant:"inset",children:[a.jsx(l,{children:a.jsx(u,{children:a.jsx(v,{children:a.jsx(b,{size:"lg",asChild:!0,children:a.jsx(n,{href:"/admin/dashboard",prefetch:!0,children:a.jsx(f,{})})})})})}),a.jsx(x,{children:a.jsx(j,{items:r})}),a.jsxs(k,{children:[a.jsx(y,{items:e,className:"mt-auto"}),a.jsx(M,{})]})]})}function F({children:s,breadcrumbs:r=[]}){const{flash:e}=d().props;return c.useEffect(()=>{e!=null&&e.success&&t.success(e.success),e!=null&&e.error&&t.error(e.error),e!=null&&e.message&&t(e.message)},[e]),a.jsxs(S,{variant:"sidebar",children:[a.jsx($,{}),a.jsxs(g,{variant:"sidebar",children:[a.jsx(N,{breadcrumbs:r}),s]})]})}export{F as A,I as U};
