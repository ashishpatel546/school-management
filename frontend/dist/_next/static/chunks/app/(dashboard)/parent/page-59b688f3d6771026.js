(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[803],{6113:(e,t,r)=>{Promise.resolve().then(r.bind(r,7874))},7874:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>c});var s=r(5155),a=r(2115),n=r(9749),l=r(3312),i=r(8002),d=r(1567);function c(){let[e,t]=(0,a.useState)([]),[r,c]=(0,a.useState)(""),[o,u]=(0,a.useState)(!1);(0,a.useEffect)(()=>{(async()=>{try{let e=localStorage.getItem("token");if(!e)return;let r=await fetch("".concat("https://school-management-app-tunnel-voon0qqt.devinapps.com","/fees"),{headers:{Authorization:"Bearer ".concat(e)}});if(!r.ok)throw Error("Failed to fetch fees");let s=await r.json();t(s)}catch(e){c(e instanceof Error?e.message:"Failed to fetch fees")}})()},[]);let f=async(e,r)=>{try{u(!0);let s=localStorage.getItem("token");if(!s)throw Error("Not authenticated");if(!(await fetch("".concat("https://school-management-app-tunnel-voon0qqt.devinapps.com","/fees/").concat(e,"/pay"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(s)},body:JSON.stringify({amount:r})})).ok)throw Error("Payment failed");t(t=>t.map(t=>t.id===e?{...t,status:"paid"}:t))}catch(e){c(e instanceof Error?e.message:"Payment failed")}finally{u(!1)}};return(0,s.jsxs)("div",{className:"space-y-6",children:[(0,s.jsx)("div",{className:"flex items-center justify-between",children:(0,s.jsx)("h1",{className:"text-3xl font-bold",children:"Parent Dashboard"})}),r&&(0,s.jsx)(i.Fc,{variant:"destructive",children:(0,s.jsx)(i.TN,{children:r})}),(0,s.jsxs)("div",{className:"grid gap-6 md:grid-cols-2",children:[(0,s.jsxs)(n.Zp,{children:[(0,s.jsxs)(n.aR,{children:[(0,s.jsx)(n.ZB,{children:"Fee Payments"}),(0,s.jsx)(n.BT,{children:"View and pay student fees"})]}),(0,s.jsx)(n.Wu,{children:(0,s.jsxs)("div",{className:"space-y-4",children:[e.map(e=>(0,s.jsxs)("div",{className:"rounded-lg border p-4 space-y-2",children:[(0,s.jsxs)("div",{className:"flex justify-between items-start",children:[(0,s.jsxs)("div",{children:[(0,s.jsxs)("h4",{className:"font-semibold",children:[e.student.firstName," ",e.student.lastName]}),(0,s.jsxs)("p",{className:"text-sm text-muted-foreground",children:["Grade ",e.class.grade," - ",e.class.section]})]}),(0,s.jsxs)("div",{className:"text-right",children:[(0,s.jsx)("p",{className:"font-semibold",children:(0,d.vv)(e.totalAmount)}),(0,s.jsxs)("p",{className:"text-sm text-muted-foreground",children:["Due: ",new Date(e.dueDate).toLocaleDateString()]})]})]}),(0,s.jsxs)("div",{className:"space-y-1",children:[(0,s.jsxs)("p",{className:"text-sm",children:["Base Fee: ",(0,d.vv)(e.amount)]}),e.extraCurriculumFee>0&&(0,s.jsxs)("p",{className:"text-sm",children:["Extra Curriculum: ",(0,d.vv)(e.extraCurriculumFee)]})]}),"pending"===e.status&&(0,s.jsx)(l.$,{className:"w-full",onClick:()=>f(e.id,e.totalAmount),disabled:o,children:o?"Processing...":"Pay Now"}),"paid"===e.status&&(0,s.jsx)("p",{className:"text-center text-sm text-green-600 font-medium",children:"Paid"}),"overdue"===e.status&&(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)("p",{className:"text-center text-sm text-red-600 font-medium",children:"Overdue"}),(0,s.jsx)(l.$,{className:"w-full",variant:"destructive",onClick:()=>f(e.id,e.totalAmount),disabled:o,children:o?"Processing...":"Pay Now (Overdue)"})]})]},e.id)),0===e.length&&(0,s.jsx)("p",{className:"text-center text-muted-foreground",children:"No fees to display"})]})})]}),(0,s.jsxs)(n.Zp,{children:[(0,s.jsxs)(n.aR,{children:[(0,s.jsx)(n.ZB,{children:"Quick Actions"}),(0,s.jsx)(n.BT,{children:"View student information and activities"})]}),(0,s.jsx)(n.Wu,{children:(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(l.$,{className:"w-full",variant:"outline",onClick:()=>{},children:"View Student Details"}),(0,s.jsx)(l.$,{className:"w-full",variant:"outline",onClick:()=>{},children:"View Attendance Records"}),(0,s.jsx)(l.$,{className:"w-full",variant:"outline",onClick:()=>{},children:"View Exam Schedule"}),(0,s.jsx)(l.$,{className:"w-full",variant:"outline",onClick:()=>{},children:"Extra Curriculum Activities"})]})})]})]})]})}},8002:(e,t,r)=>{"use strict";r.d(t,{Fc:()=>d,TN:()=>c});var s=r(5155),a=r(2115),n=r(1027),l=r(1567);let i=(0,n.F)("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),d=a.forwardRef((e,t)=>{let{className:r,variant:a,...n}=e;return(0,s.jsx)("div",{ref:t,role:"alert",className:(0,l.cn)(i({variant:a}),r),...n})});d.displayName="Alert",a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("h5",{ref:t,className:(0,l.cn)("mb-1 font-medium leading-none tracking-tight",r),...a})}).displayName="AlertTitle";let c=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("div",{ref:t,className:(0,l.cn)("text-sm [&_p]:leading-relaxed",r),...a})});c.displayName="AlertDescription"},3312:(e,t,r)=>{"use strict";r.d(t,{$:()=>c});var s=r(5155),a=r(2115),n=r(1290),l=r(1027),i=r(1567);let d=(0,l.F)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),c=a.forwardRef((e,t)=>{let{className:r,variant:a,size:l,asChild:c=!1,...o}=e,u=c?n.DX:"button";return(0,s.jsx)(u,{className:(0,i.cn)(d({variant:a,size:l,className:r})),ref:t,...o})});c.displayName="Button"},9749:(e,t,r)=>{"use strict";r.d(t,{BT:()=>c,Wu:()=>o,ZB:()=>d,Zp:()=>l,aR:()=>i});var s=r(5155),a=r(2115),n=r(1567);let l=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("div",{ref:t,className:(0,n.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",r),...a})});l.displayName="Card";let i=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("div",{ref:t,className:(0,n.cn)("flex flex-col space-y-1.5 p-6",r),...a})});i.displayName="CardHeader";let d=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("h3",{ref:t,className:(0,n.cn)("text-2xl font-semibold leading-none tracking-tight",r),...a})});d.displayName="CardTitle";let c=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("p",{ref:t,className:(0,n.cn)("text-sm text-muted-foreground",r),...a})});c.displayName="CardDescription";let o=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("div",{ref:t,className:(0,n.cn)("p-6 pt-0",r),...a})});o.displayName="CardContent",a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("div",{ref:t,className:(0,n.cn)("flex items-center p-6 pt-0",r),...a})}).displayName="CardFooter"},1567:(e,t,r)=>{"use strict";r.d(t,{cn:()=>n,vv:()=>l});var s=r(3463),a=r(9795);function n(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,a.QP)((0,s.$)(t))}function l(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(e)}},1290:(e,t,r)=>{"use strict";r.d(t,{DX:()=>l});var s=r(2115);function a(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}var n=r(5155),l=s.forwardRef((e,t)=>{let{children:r,...a}=e,l=s.Children.toArray(r),d=l.find(c);if(d){let e=d.props.children,r=l.map(t=>t!==d?t:s.Children.count(e)>1?s.Children.only(null):s.isValidElement(e)?e.props.children:null);return(0,n.jsx)(i,{...a,ref:t,children:s.isValidElement(e)?s.cloneElement(e,void 0,r):null})}return(0,n.jsx)(i,{...a,ref:t,children:r})});l.displayName="Slot";var i=s.forwardRef((e,t)=>{let{children:r,...n}=e;if(s.isValidElement(r)){let e=function(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,r=t&&"isReactWarning"in t&&t.isReactWarning;return r?e.ref:(r=(t=Object.getOwnPropertyDescriptor(e,"ref")?.get)&&"isReactWarning"in t&&t.isReactWarning)?e.props.ref:e.props.ref||e.ref}(r);return s.cloneElement(r,{...function(e,t){let r={...t};for(let s in t){let a=e[s],n=t[s];/^on[A-Z]/.test(s)?a&&n?r[s]=(...e)=>{n(...e),a(...e)}:a&&(r[s]=a):"style"===s?r[s]={...a,...n}:"className"===s&&(r[s]=[a,n].filter(Boolean).join(" "))}return{...e,...r}}(n,r.props),ref:t?function(...e){return t=>{let r=!1,s=e.map(e=>{let s=a(e,t);return r||"function"!=typeof s||(r=!0),s});if(r)return()=>{for(let t=0;t<s.length;t++){let r=s[t];"function"==typeof r?r():a(e[t],null)}}}}(t,e):e})}return s.Children.count(r)>1?s.Children.only(null):null});i.displayName="SlotClone";var d=({children:e})=>(0,n.jsx)(n.Fragment,{children:e});function c(e){return s.isValidElement(e)&&e.type===d}}},e=>{var t=t=>e(e.s=t);e.O(0,[433,441,517,358],()=>t(6113)),_N_E=e.O()}]);