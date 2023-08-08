

const Validator = function(options){
    const formElement = document.querySelector(options.form);
    var selectorRules = [];

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
    }

    function validate(inputElement, rule){
        const errorElement = inputElement.parentElement.querySelector('.form-message');
        var rules = selectorRules[rule.selector];
        var messageError;

        for(var i=0; i<rules.length; ++i){
            messageError = rules[i](inputElement.value);
            if(messageError)
                break;
        }

        if(messageError){
            errorElement.innerText = messageError;
            inputElement.parentElement.classList.add('invalid');
        }else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
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