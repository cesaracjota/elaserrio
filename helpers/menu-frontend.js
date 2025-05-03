const getMenuFrontEnd = (role, sede) => {
    // Definir los módulos disponibles para cada rol
    const modulosPorRol = {
        ADMIN_ROLE: [
            { titulo: 'Inicio', icono: 'RiHome5Fill', path: '/' },
            { titulo: 'Usuarios', icono: 'FaUsers', path: '/usuarios' },
            { titulo: 'Periodo Escolar', icono: 'FaUsers', path: '/periodo-escolar' },
            { titulo: 'Matriculas', icono: 'MdGrade', path: '/matriculas' },
            { titulo: 'Grados', icono: 'MdGrade', path: '/grados' },
            { titulo: 'Estudiantes', icono: 'RiUserStarFill', path: '/estudiantes' },
            { titulo: 'Egresos', icono: 'FaChartPie', path: '/egresos' },
            { titulo: 'Pagos', icono: 'MdMonetizationOn', path: '/pagos' },
            { titulo: 'Concepto Pagos', icono: 'MdMonetizationOn', path: '/concepto_pagos' },
            { titulo: 'Gestionar Tramites', icono: 'FaChartPie', path: '/tramites' },
            { titulo: 'Docentes', icono: 'FaChalkboardTeacher', path: '/docentes' },
            { titulo: 'Uniformes', icono: 'FaVest', path: '/uniformes' },
            { titulo: 'Reportes', icono: 'FaChartPie', path: '/reportes' }
        ],
        DOCENTE_ROLE: [
            { titulo: 'Inicio', icono: 'RiHome5Fill', path: '/' },
            { titulo: 'Cursos', icono: 'MdGrade', path: '/cursos' },
            { titulo: 'Grados', icono: 'MdGrade', path: '/grados' },
            { titulo: 'Estudiantes', icono: 'RiUserStarFill', path: '/estudiantes' }
        ],
        USER_ROLE: [
            { titulo: 'Inicio', icono: 'RiHome5Fill', path: '/' },
            { titulo: 'Pagos', icono: 'MdMonetizationOn', path: '/pagos' }
        ]
    };

    // Obtener los módulos según el rol
    const menu = modulosPorRol[role] || [];

    // Agregar el módulo de sede
    if (sede) {
        menu.push({
            titulo: sede.nombre,
            icono: 'FaBuilding',
            path: `/sede/${sede._id}`
        });
    }

    return menu;
};

module.exports = {
    getMenuFrontEnd
};