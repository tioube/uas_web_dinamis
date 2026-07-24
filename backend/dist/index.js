"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files for uploads
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (req, res) => {
    res.send('API Sistem Pendaftaran Kegiatan Kampus is running...');
});
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const kegiatan_routes_1 = __importDefault(require("./routes/kegiatan.routes"));
const peserta_routes_1 = __importDefault(require("./routes/peserta.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
// Import Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/kegiatan', kegiatan_routes_1.default);
app.use('/api/peserta', peserta_routes_1.default);
app.use('/api/users', user_routes_1.default);
// Global Error Handler
app.use(error_middleware_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
