
//* Đối tượng Validator
Validator = (options) => {
    // lay element form can validate
    var formElement = document.querySelector(options.form)
    var selectorRules = {};

    if (formElement) {
        // Bỏ hành vi mặc định submit
        formElement.onsubmit = (e) => {
            e.preventDefault();
        }
        // Lặp qua rules và xử lí onblur
        options.rules.forEach((rule) => {
            //* luu lai rules cho moi input
            // nếu k là mảng thì gán = array [rule.test]
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            //* Click ra ngoai => validate
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                }
            }
        });
    }

    //* Ha`m thuc hien validate
    validate = (inputElement, rule) => {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
        // console.log('blur' + rule.selector); 
        // console.log(inputElement.value); : check user input
        // value: inputElement.value
        // test function: rule.test

        //* lay ra cac rule cua selector
        var rules = selectorRules[rule.selector];

        //* lap qa tung rule & ktra 
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) {
             break;   
            }
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = ('');
            inputElement.parentElement.classList.remove('invalid');
        }
    }
}

//* Định nghĩa rules
// nguyen tac cua rules: 
// 1. khi co error => return error
// 2. khi hop le => return undefined
Validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            // du`ng trim de loai bo dau cach 2 dau input
            return value.trim() ? undefined : message || 'Please import this blank !'
        }
    }
}
Validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            // validate mail by regex pattern
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || "Not the correct email format !";
        }
    };
}
Validator.minLength = (selector, min, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value.length >= min ? undefined : message || 'Password requires min character equal 6';
        }
    }
}
Validator.isConfirmed = (selector, getConfirmValue, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value === getConfirmValue() ? undefined : "Invalid Password Repeatation";
        }
    }
}


