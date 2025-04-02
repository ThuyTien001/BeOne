export const MENU_ITEMS = [
    { label: 'Tổng quát', icon: 'icomoon icon-home4', routerLink: ['/pages/dashboard'] },
    { label: 'Lý lịch học sinh', icon: 'icomoon icon-user-plus', routerLink: ['/pages/profile'] },
    { label: 'Khóa học', icon: 'icomoon icon-book', routerLink: ['/pages/my-lessons'] },
    { label: 'Thời khóa biểu', icon: 'icomoon icon-calendar' },

    {
        label: 'Khác',
        icon: 'pi pi-fw pi-bars',
        items: [
            { label: 'Bài tập', icon: 'pi pi-fw pi-book', routerLink: ['/pages/do-exercises'] },
            { label: 'Câu hỏi', icon: 'pi pi-fw pi-info-circle', routerLink: ['/pages/questions'] },
            { label: 'Soạn bài tập', icon: 'pi pi-fw pi-book', routerLink: ['/pages/exercises'] },
        ]
    },

   
];

export const MENU_FOR_TEACHER = [
    { label: 'Questions', icon: 'pi pi-fw pi-home', routerLink: ['/pages/questions'] },
];