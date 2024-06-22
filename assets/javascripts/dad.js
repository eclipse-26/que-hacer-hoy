
addEventListener("load", () =>{
    let cols = document.querySelectorAll('.goal__list .goal__item');
    // hook up event handlers
    [].forEach.call(cols, function (col) {
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragenter', handleDragEnter, false)
        col.addEventListener('dragover', handleDragOver, false);
        col.addEventListener('dragleave', handleDragLeave, false);
        col.addEventListener('drop', handleDrop, false);
        col.addEventListener('dragend', handleDragEnd, false);
    });

    let dragSrcEl = null;
    function handleDragStart(e) {
        if (e.target.className.indexOf('goal__item') > -1) {
            dragSrcEl = e.target;
            dragSrcEl.style.opacity = '1';
            let dt = e.dataTransfer;
            dt.effectAllowed = 'move';
            dt.setData('text', dragSrcEl.innerHTML);

            // customize drag image for one of the panels
            if (dt.setDragImage instanceof Function && e.target.innerHTML.indexOf('X') > -1) {
                let img = new Image();
                img.src = 'dragimage.jpg';
                dt.setDragImage(img, img.width / 2, img.height / 2);
            }
        }
    }
    function handleDragOver(e) {
        if (dragSrcEl) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    }
    function handleDragEnter(e) {
        if (dragSrcEl) {
            e.target.classList.add('over');
        }
    }
    function handleDragLeave(e) {
        if (dragSrcEl) {
            e.target.classList.remove('over');
        }
    }
    function handleDragEnd(e) {
        dragSrcEl = null;
        [].forEach.call(cols, function (col) {
            col.style.opacity = '';
            col.classList.remove('over');
        });
    }
    function handleDrop(e) {
        if (dragSrcEl) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            if (dragSrcEl != this) {
                swapDom(dragSrcEl, this);
                //dragSrcEl.innerHTML = e.target.innerHTML;
                //this.innerHTML = e.dataTransfer.getData('text');
            }
        }
    }

    // https://stackoverflow.com/questions/9732624/how-to-swap-dom-child-nodes-in-javascript
    function swapDom(a,b) {
        let aParent = a.parentNode;
        let bParent = b.parentNode;
        let aHolder = document.createElement("div");
        let bHolder = document.createElement("div");
        aParent.replaceChild(aHolder, a);
        bParent.replaceChild(bHolder, b);
        aParent.replaceChild(b, aHolder);
        bParent.replaceChild(a, bHolder);    
    }    
})
