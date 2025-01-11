class Node {
    constructor(value, x = 0, y = 0) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = x;
        this.y = y;
    }
}

class ActionBST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);
        if (this.root == null) {
            this.root = newNode;
        } else {
            this.#insertNode(this.root, newNode);
        }
    }

    #insertNode(node, newNode) {
        if (newNode.value === node.value) return;
        if (newNode.value < node.value) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.#insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.#insertNode(node.right, newNode);
            }
        }
    }
    // Xóa node khỏi cây
    delete(value) {
        this.root = this.#deleteNode(this.root, value);
    }

    #deleteNode(node, value) {
        if (node === null) return null; // Node không tồn tại

        if (value < node.value) {
            node.left = this.#deleteNode(node.left, value); // Xóa ở nhánh trái
            return node;
        } else if (value > node.value) {
            node.right = this.#deleteNode(node.right, value); // Xóa ở nhánh phải
            return node;
        } else {
            // Node cần xóa đã được tìm thấy
            if (node.left === null && node.right === null) {
                // Trường hợp node không có con
                return null;
            } else if (node.left === null) {
                // Trường hợp node chỉ có con phải
                return node.right;
            } else if (node.right === null) {
                // Trường hợp node chỉ có con trái
                return node.left;
            } else {
                const minRightValue 
                    = this.#findMinNode(node.right).value; 
                node.value = minRightValue; 
                node.right = this.#deleteNode
                            (node.right, minRightValue);
                return node;
            }
        }
    }

    #findMinNode(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }
    inOrder(node, result = []) {
        if (node !== null) {
            this.inOrder(node.left, result);
            result.push(node);
            this.inOrder(node.right, result);
        }
        return result;
    }

    levelOrder() {
        const levels = [];
        if (this.root === null) return levels;

        const queue = [{ node: this.root, level: 0 }];
        while (queue.length > 0) {
            const { node, level } = queue.shift();
            if (!levels[level]) levels[level] = [];
            levels[level].push(node);

            if (node.left) queue.push({ node: node.left, level: level + 1 });
            if (node.right) queue.push({ node: node.right, level: level + 1 });
        }
        return levels;
    }
}

function drawTree(bst) {
    const canvas = document.getElementById("treeCanvas");
    const ctx = canvas.getContext("2d");
    const canvasWidth = canvas.width;

    // Ánh xạ vị trí ngang
    const inOrderNodes = bst.inOrder(bst.root);
    const horizontalSpacing = canvasWidth / inOrderNodes.length;
    inOrderNodes.forEach((node, index) => {
        node.x = index * horizontalSpacing + horizontalSpacing / 2;
    });

    // Ánh xạ vị trí dọc
    const levels = bst.levelOrder();
    const verticalSpacing = 70;
    levels.forEach((level, levelIndex) => {
        level.forEach((node) => {
            node.y = levelIndex * verticalSpacing + 50;
        });
    });

    // Xóa canvas trước khi vẽ
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ các đường nối
    function drawLine(node1, node2) {
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
    levels.forEach((level) => {
        level.forEach((node) => {
            if (node.left) drawLine(node, node.left);
            if (node.right) drawLine(node, node.right);
        });
    });

    // Vẽ các node
    function drawNode(node) {
        const radius = 22;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        // ctx.strokeStyle = "black";
        // ctx.stroke();
         // Thêm viền node
        ctx.lineWidth = 4; // Tăng độ dày viền
        ctx.strokeStyle = "#FFB800 "; // Màu viền xanh lá cây tươi
        ctx.stroke();
         // Hiệu ứng bóng
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        //
        // Vẽ giá trị node
        ctx.shadowColor = "transparent"; // Tắt bóng cho chữ
        ctx.fillStyle = "#000000"; // Màu chữ (đen)
        ctx.font = "16px Arial"; // Font chữ
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.value, node.x, node.y);

    }
    inOrderNodes.forEach((node) => drawNode(node));
}

// Khởi tạo cây nhị phân tìm kiếm
const bst = new ActionBST();

// Xử lý sự kiện khi nhấn nút "Hiển thị cây"
document.getElementById("drawTreeBtn").addEventListener("click", () => {
    const input = document.getElementById("nodeValues").value; // Lấy giá trị từ input
    const values = input
        .split(" ")
        .map(Number)
        .filter((v) => !isNaN(v)); // Chuyển các giá trị thành số, loại bỏ giá trị không hợp lệ

    if (values.length === 0) {
        alert("Vui lòng nhập ít nhất một giá trị hợp lệ!");
        return;
    }

    // Thêm các giá trị vào cây
    values.forEach((value) => bst.insert(value));

    // Hiển thị lại cây
    drawTree(bst);
});

// Xử lý sự kiện khi nhấn nút "Thêm"
document.getElementById("addNodeBtn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("addNodeValue").value, 10);
    if (isNaN(value)) {
        alert("Vui lòng nhập giá trị hợp lệ để thêm!");
        return;
    }

    bst.insert(value); // Thêm node vào cây
    drawTree(bst); // Hiển thị lại cây
});

// Xử lý sự kiện khi nhấn nút "Xóa"
document.getElementById("deleteNodeBtn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("deleteNodeValue").value, 10);
    if (isNaN(value)) {
        alert("Vui lòng nhập giá trị hợp lệ để xóa!");
        return;
    }

    bst.delete(value); // Xóa node khỏi cây (thêm phương thức delete trong ActionBST)
    drawTree(bst); // Hiển thị lại cây
});