(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[267],{3853:(e,t,r)=>{Promise.resolve().then(r.bind(r,2436))},2436:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>f});var a=r(5155),s=r(2115),n=r(9749),l=r(3312),d=r(8002),i=r(3886),c=r(9606),o=r(2679),u=r(3415);let m=u.Ik({classId:u.Yj().min(1,"Please select a class"),date:u.Yj().min(1,"Please select a date"),presentStudentIds:u.YO(u.Yj())});function f(){let[e,t]=(0,s.useState)([]),[r,u]=(0,s.useState)(""),[f,x]=(0,s.useState)(null),[h,p]=(0,s.useState)(!1),v=(0,c.mN)({resolver:(0,o.u)(m),defaultValues:{classId:"",date:new Date().toISOString().split("T")[0],presentStudentIds:[]}});(0,s.useEffect)(()=>{(async()=>{try{let e=localStorage.getItem("token");if(!e)return;let r=await fetch("".concat("https://school-management-app-tunnel-voon0qqt.devinapps.com","/classes"),{headers:{Authorization:"Bearer ".concat(e)}});if(!r.ok)throw Error("Failed to fetch classes");let a=await r.json();t(a)}catch(e){u(e instanceof Error?e.message:"Failed to fetch classes")}})()},[]);let g=async t=>{x(e.find(e=>e.id===t)||null),v.setValue("classId",t),v.setValue("presentStudentIds",[])},j=async e=>{try{p(!0);let t=localStorage.getItem("token");if(!t)throw Error("Not authenticated");if(!(await fetch("".concat("https://school-management-app-tunnel-voon0qqt.devinapps.com","/attendance/bulk"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(t)},body:JSON.stringify(e)})).ok)throw Error("Failed to mark attendance");v.reset({classId:"",date:new Date().toISOString().split("T")[0],presentStudentIds:[]}),x(null)}catch(e){u(e instanceof Error?e.message:"Failed to mark attendance")}finally{p(!1)}},N=e=>{let t=v.getValues("presentStudentIds"),r=t.includes(e)?t.filter(t=>t!==e):[...t,e];v.setValue("presentStudentIds",r)};return(0,a.jsxs)("div",{className:"space-y-6",children:[(0,a.jsx)("div",{className:"flex items-center justify-between",children:(0,a.jsx)("h1",{className:"text-3xl font-bold",children:"Teacher Dashboard"})}),(0,a.jsxs)("div",{className:"grid gap-6 md:grid-cols-2",children:[(0,a.jsxs)(n.Zp,{children:[(0,a.jsxs)(n.aR,{children:[(0,a.jsx)(n.ZB,{children:"Mark Attendance"}),(0,a.jsx)(n.BT,{children:"Select class and mark student attendance"})]}),(0,a.jsxs)(n.Wu,{children:[r&&(0,a.jsx)(d.Fc,{variant:"destructive",className:"mb-4",children:(0,a.jsx)(d.TN,{children:r})}),(0,a.jsx)(i.lV,{...v,children:(0,a.jsxs)("form",{onSubmit:v.handleSubmit(j),className:"space-y-4",children:[(0,a.jsx)(i.zB,{control:v.control,name:"classId",render:()=>(0,a.jsxs)(i.eI,{children:[(0,a.jsx)(i.lR,{children:"Select Class"}),(0,a.jsx)(i.MJ,{children:(0,a.jsxs)("select",{className:"w-full rounded-md border p-2",onChange:e=>g(e.target.value),value:v.getValues("classId"),children:[(0,a.jsx)("option",{value:"",children:"Select a class"}),e.map(e=>(0,a.jsxs)("option",{value:e.id,children:["Grade ",e.grade," - ",e.section]},e.id))]})})]})}),(0,a.jsx)(i.zB,{control:v.control,name:"date",render:e=>{let{field:t}=e;return(0,a.jsxs)(i.eI,{children:[(0,a.jsx)(i.lR,{children:"Date"}),(0,a.jsx)(i.MJ,{children:(0,a.jsx)("input",{type:"date",className:"w-full rounded-md border p-2",...t})})]})}}),f&&(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(i.lR,{children:"Students"}),f.students.map(e=>(0,a.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,a.jsx)("input",{type:"checkbox",id:e.id,checked:v.getValues("presentStudentIds").includes(e.id),onChange:()=>N(e.id),className:"h-4 w-4 rounded border-gray-300"}),(0,a.jsxs)("label",{htmlFor:e.id,children:[e.firstName," ",e.lastName]})]},e.id))]}),(0,a.jsx)(l.$,{type:"submit",className:"w-full",disabled:h,children:h?"Marking Attendance...":"Mark Attendance"})]})})]})]}),(0,a.jsxs)(n.Zp,{children:[(0,a.jsxs)(n.aR,{children:[(0,a.jsx)(n.ZB,{children:"Quick Actions"}),(0,a.jsx)(n.BT,{children:"View and manage your classes"})]}),(0,a.jsx)(n.Wu,{children:(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(l.$,{className:"w-full",variant:"outline",onClick:()=>{},children:"View My Classes"}),(0,a.jsx)(l.$,{className:"w-full",variant:"outline",onClick:()=>{},children:"View Attendance Records"}),(0,a.jsx)(l.$,{className:"w-full",variant:"outline",onClick:()=>{},children:"View Exam Schedule"})]})})]})]})]})}},8002:(e,t,r)=>{"use strict";r.d(t,{Fc:()=>i,TN:()=>c});var a=r(5155),s=r(2115),n=r(1027),l=r(1567);let d=(0,n.F)("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),i=s.forwardRef((e,t)=>{let{className:r,variant:s,...n}=e;return(0,a.jsx)("div",{ref:t,role:"alert",className:(0,l.cn)(d({variant:s}),r),...n})});i.displayName="Alert",s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,a.jsx)("h5",{ref:t,className:(0,l.cn)("mb-1 font-medium leading-none tracking-tight",r),...s})}).displayName="AlertTitle";let c=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,a.jsx)("div",{ref:t,className:(0,l.cn)("text-sm [&_p]:leading-relaxed",r),...s})});c.displayName="AlertDescription"},3312:(e,t,r)=>{"use strict";r.d(t,{$:()=>c});var a=r(5155),s=r(2115),n=r(1290),l=r(1027),d=r(1567);let i=(0,l.F)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),c=s.forwardRef((e,t)=>{let{className:r,variant:s,size:l,asChild:c=!1,...o}=e,u=c?n.DX:"button";return(0,a.jsx)(u,{className:(0,d.cn)(i({variant:s,size:l,className:r})),ref:t,...o})});c.displayName="Button"},9749:(e,t,r)=>{"use strict";r.d(t,{BT:()=>c,Wu:()=>o,ZB:()=>i,Zp:()=>l,aR:()=>d});var a=r(5155),s=r(2115),n=r(1567);let l=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,a.jsx)("div",{ref:t,className:(0,n.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",r),...s})});l.displayName="Card";let d=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,a.jsx)("div",{ref:t,className:(0,n.cn)("flex flex-col space-y-1.5 p-6",r),...s})});d.displayName="CardHeader";let i=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,a.jsx)("h3",{ref:t,className:(0,n.cn)("text-2xl font-semibold leading-none tracking-tight",r),...s})});i.displayName="CardTitle";let c=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,a.jsx)("p",{ref:t,className:(0,n.cn)("text-sm text-muted-foreground",r),...s})});c.displayName="CardDescription";let o=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,a.jsx)("div",{ref:t,className:(0,n.cn)("p-6 pt-0",r),...s})});o.displayName="CardContent",s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,a.jsx)("div",{ref:t,className:(0,n.cn)("flex items-center p-6 pt-0",r),...s})}).displayName="CardFooter"},3886:(e,t,r)=>{"use strict";r.d(t,{lV:()=>u,MJ:()=>g,zB:()=>f,eI:()=>p,lR:()=>v,C5:()=>j});var a=r(5155),s=r(2115),n=r(1290),l=r(9606),d=r(1567),i=r(472);let c=(0,r(1027).F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),o=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,a.jsx)(i.b,{ref:t,className:(0,d.cn)(c(),r),...s})});o.displayName=i.b.displayName;let u=l.Op,m=s.createContext({}),f=e=>{let{...t}=e;return(0,a.jsx)(m.Provider,{value:{name:t.name},children:(0,a.jsx)(l.xI,{...t})})},x=()=>{let e=s.useContext(m),t=s.useContext(h),{getFieldState:r,formState:a}=(0,l.xW)(),n=r(e.name,a);if(!e)throw Error("useFormField should be used within <FormField>");let{id:d}=t;return{id:d,name:e.name,formItemId:"".concat(d,"-form-item"),formDescriptionId:"".concat(d,"-form-item-description"),formMessageId:"".concat(d,"-form-item-message"),...n}},h=s.createContext({}),p=s.forwardRef((e,t)=>{let{className:r,...n}=e,l=s.useId();return(0,a.jsx)(h.Provider,{value:{id:l},children:(0,a.jsx)("div",{ref:t,className:(0,d.cn)("space-y-2",r),...n})})});p.displayName="FormItem";let v=s.forwardRef((e,t)=>{let{className:r,...s}=e,{error:n,formItemId:l}=x();return(0,a.jsx)(o,{ref:t,className:(0,d.cn)(n&&"text-destructive",r),htmlFor:l,...s})});v.displayName="FormLabel";let g=s.forwardRef((e,t)=>{let{...r}=e,{error:s,formItemId:l,formDescriptionId:d,formMessageId:i}=x();return(0,a.jsx)(n.DX,{ref:t,id:l,"aria-describedby":s?"".concat(d," ").concat(i):"".concat(d),"aria-invalid":!!s,...r})});g.displayName="FormControl",s.forwardRef((e,t)=>{let{className:r,...s}=e,{formDescriptionId:n}=x();return(0,a.jsx)("p",{ref:t,id:n,className:(0,d.cn)("text-[0.8rem] text-muted-foreground",r),...s})}).displayName="FormDescription";let j=s.forwardRef((e,t)=>{let{className:r,children:s,...n}=e,{error:l,formMessageId:i}=x(),c=l?String(null==l?void 0:l.message):s;return c?(0,a.jsx)("p",{ref:t,id:i,className:(0,d.cn)("text-[0.8rem] font-medium text-destructive",r),...n,children:c}):null});j.displayName="FormMessage"},1567:(e,t,r)=>{"use strict";r.d(t,{cn:()=>n,vv:()=>l});var a=r(3463),s=r(9795);function n(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,s.QP)((0,a.$)(t))}function l(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(e)}}},e=>{var t=t=>e(e.s=t);e.O(0,[433,861,441,517,358],()=>t(3853)),_N_E=e.O()}]);