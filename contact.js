document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    // Validación en tiempo real
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
            hideMessage();
        });
    });

    // Envío del formulario
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar todo el formulario
        if (!validateForm()) {
            showMessage('Por favor completa todos los campos requeridos correctamente', 'error');
            return;
        }
        
        // Configurar estado de carga
        setLoadingState(true);
        hideMessage();
        
        try {
            // Enviar datos a Formspree
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Manejar respuesta
            if (response.ok) {
                showMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en el servidor');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showMessage('Error al enviar el mensaje. Por favor inténtalo nuevamente más tarde.', 'error');
        } finally {
            setLoadingState(false);
        }
    });
    
    // Función para validar campo individual
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return true;
        
        const errorMsg = formGroup.querySelector('.error-msg');
        formGroup.classList.remove('invalid');
        
        // Validar campo requerido
        if (field.required && !field.value.trim()) {
            formGroup.classList.add('invalid');
            if (errorMsg) errorMsg.textContent = 'Este campo es obligatorio';
            return false;
        }
        
        // Validar email
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                formGroup.classList.add('invalid');
                if (errorMsg) errorMsg.textContent = 'Ingresa un email válido';
                return false;
            }
        }
        
        // Validar longitud mínima para mensaje
        if (field.name === 'mensaje' && field.value.trim().length < 10) {
            formGroup.classList.add('invalid');
            if (errorMsg) errorMsg.textContent = 'El mensaje debe tener al menos 10 caracteres';
            return false;
        }
        
        return true;
    }
    
    // Función para validar todo el formulario
    function validateForm() {
        let isValid = true;
        
        contactForm.querySelectorAll('[required]').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
                
                // Scroll al primer error
                if (isValid === false) {
                    field.focus({ preventScroll: true });
                    setTimeout(() => {
                        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
            }
        });
        
        return isValid;
    }
    
    // Mostrar mensaje de estado
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll al mensaje si hay error
        if (type === 'error') {
            setTimeout(() => {
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
    
    // Ocultar mensaje
    function hideMessage() {
        formMessage.style.display = 'none';
    }
    
    // Estado de carga
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    // Limpiar errores al hacer clic en campos
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('focus', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup) formGroup.classList.remove('invalid');
        });
    });
});