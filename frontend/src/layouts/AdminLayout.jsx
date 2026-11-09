import { Outlet } from "react-router-dom";

function AdminLayout(){
    return(
        <div>
            <header>
                <h2>VECTIS Admin</h2>
                <nav>Admin Navigation bar</nav>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default AdminLayout;