const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
}

export default handleLogout;