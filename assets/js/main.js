

const Validator = function(options){
    const formElement = document.querySelector(options.form);
    var selectorRules = [];
    var isValid;

    // Hàm xử lý bắt lỗi
    function validate(inputElement, rule){
        const errorElement = inputElement.parentElement.querySelector('.form-message');
        var rules = selectorRules[rule.selector];
        var messageError;

        for(var i=0; i<rules.length; ++i){
            messageError = rules[i](inputElement.value);
            if(messageError)
                break;
        }

        // Hiển thị lỗi tương ứng tìm được ra HTML
        if(messageError){
            errorElement.innerText = messageError;
            inputElement.parentElement.classList.add('invalid');
        }else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }

        return !!messageError;
    }

    if(formElement){
        options.rules.forEach(function(rule){
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test];
            }
        
            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement){
                inputElement.onblur = function(){
                    validate(inputElement, rule);
                }
            }
        });

        formElement.onsubmit = function(e){
            var isFormValid = false;
            e.preventDefault();

            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                isValid = validate(inputElement, rule);
                if(isValid){
                    isFormValid = true;
                }
            });

            if(!isFormValid){
                // Submit với hành vi tự định nghĩa
                if(typeof options.onSubmit === 'function'){
                    var elementInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(elementInputs).reduce(function(values, input){
                        return (values[input.name] = input.value) && values;
                    }, {});

                    options.onSubmit(formValues);
                } else {    // Submit với hành vi mặc định
                    formElement.submit();
                }
            }

        }
    }
};

// Kiểm tra các trường là bắt buộc
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : message || 'Trường này là bắt buộc!';
        }
    }
}

// Kiểm tra trường đã nhập có đúng định dạng email không
Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return re.test(value) ? undefined : message ||  'Vui lòng nhập trường này!';
        }
    }
}

// Check độ dài tối thiểu cho trường dữ liệu
Validator.minLength = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.length > 5 ? undefined : message || 'Vui lòng nhập đủ 6 kí tự';
        }
    }
}

// Check đúng sai cho trường dữ liệu dạng nhập lại
Validator.isConfirmed = function(selector, getConfirmValue, message){
    return {
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập lại không đúng';
        }
    }
}