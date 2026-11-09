import {Outlet} from "react-router-dom"

function UserLayout(){
    return(
        <div>
            <header>
                <h2>VECTIS</h2>
                <nav> User Navigation bar</nav>
            </header>
            <main>
                <Outlet/>
            </main>
            <footer>VECTIS © 2026</footer>
        </div>
    )
}

export default UserLayout