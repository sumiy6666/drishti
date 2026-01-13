import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

const showAlert = (title, text, icon = 'success') => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: '#2563EB', // Primary blue
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'px-6 py-2.5 rounded-xl font-bold'
        }
    });
};

const showConfirm = (title, text, confirmButtonText = 'Yes, do it!') => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2563EB',
        cancelButtonColor: '#d33',
        confirmButtonText,
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'px-6 py-2.5 rounded-xl font-bold',
            cancelButton: 'px-6 py-2.5 rounded-xl font-bold'
        }
    });
};

export { Swal, Toast, showAlert, showConfirm };
