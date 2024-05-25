import NextLink from 'next/link'

const Sidebar = () => {
    return (   
        <ul className="menu gap-0 sm:gap-5  sidebar">
   
    
   <li className="tooltip tooltip-right" data-tip="Home"> 
       <NextLink href="/">
        <i className="fi fi-rr-home"></i>
       </NextLink>
   </li>
   <li className="tooltip tooltip-right" data-tip="Backtest">
       <NextLink href="/backtest">
        <i className="fi fi-rr-blood-test-tube-alt"></i>
       </NextLink>
   </li>
   <li className="tooltip tooltip-right" data-tip="Contact us">
       <NextLink href="/contact">
        <i className="fi fi-rr-envelope"></i>
       </NextLink>
   </li>
   <li className="tooltip tooltip-right" data-tip="About us">
       <NextLink href="/about">
        <i className="fi fi-rr-info"></i>
       </NextLink>
   </li>
</ul>
   );
}
 
export default Sidebar;