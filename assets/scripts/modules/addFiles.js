;(function() {

    function Files(self, area, button) {
    	this._self = self;
        this._area = this._self.querySelectorAll('.' + area)[0];
        this._button = this._self.querySelectorAll('.' + button)[0];

        this._init();
    }

    Files.prototype.click = function() {
        var self = this;

        if (this._area.querySelectorAll('input').length) {
            var inputs = this._area.querySelectorAll('input');

            if (!inputs[inputs.length - 1].value) {
                inputs[inputs.length - 1].click();
            }
            else {
                self.addRow();
            }
        }
        else {
            this.addRow();
        }


    }

    Files.prototype.addRow = function() {
        var input = document.createElement('div');
        input.className = 'file-line';
        input.innerHTML = '<div class="file-line__name">Выберите файл.</div><input type="file" class="file-line__input" style="display: none;"><div class="file-line__close">+</div>';


        this._area.appendChild(input);
        new ChangeName(input, 'file-line__name', 'file-line__input', 'file-line__close');
        input.querySelectorAll('.file-line__input')[0].click();
    }

    Files.prototype._init = function() {
        var self = this;
        this._button.addEventListener('click', function() {
            self.click();
        });
    }

    function ChangeName(self, name, input, close) {
        this._self = self;
        this._name = this._self.querySelectorAll('.' + name)[0];
        this._input = this._self.querySelectorAll('.' + input)[0];
        this._close = this._self.querySelectorAll('.' + close)[0];

        this._init();
    }

    ChangeName.prototype.changeName = function() {
        var self = this;

        var filename = this._input.value.replace(/.*\\/, "");
        this._name.innerHTML = 'Имя файла: <span class="text-success">' + filename + '</span>';
    }

    ChangeName.prototype.changeClick = function() {
        var self = this;

        this._input.click();
    }

    ChangeName.prototype.close = function() {
        var self = this;

        this._self.remove();
    }

    ChangeName.prototype._init = function() {
        var self = this;

        this._input.addEventListener('change', function() {
            self.changeName();
        });

        this._name.addEventListener('click', function() {
            self.changeClick();
        });

        this._close.addEventListener('click', function() {
            self.close();
        });
    }

    var files = document.querySelectorAll('.files');
    for (var i = 0; i < files.length; i++) {
        var item = files[i];
        var file = new Files(item, 'files__area', 'files__button');
    }

})();
