"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KegiatanController = void 0;
const kegiatan_repository_1 = require("../repositories/kegiatan.repository");
class KegiatanController {
    constructor() {
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const search = req.query.search || '';
                const filter = req.query.filter || '';
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const offset = (page - 1) * limit;
                const result = yield this.kegiatanRepository.findAll(search, filter, limit, offset);
                res.json({
                    status: 'success',
                    data: result.data,
                    pagination: {
                        total: result.total,
                        page,
                        limit,
                        totalPages: Math.ceil(result.total / limit)
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const data = yield this.kegiatanRepository.findById(id);
                if (!data) {
                    return res.status(404).json({ status: 'error', message: 'Kegiatan not found' });
                }
                res.json({ status: 'success', data });
            }
            catch (error) {
                next(error);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = yield this.kegiatanRepository.create(req.body);
                res.status(201).json({ status: 'success', message: 'Kegiatan created', data: { id } });
            }
            catch (error) {
                next(error);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const success = yield this.kegiatanRepository.update(id, req.body);
                if (!success) {
                    return res.status(404).json({ status: 'error', message: 'Kegiatan not found' });
                }
                res.json({ status: 'success', message: 'Kegiatan updated' });
            }
            catch (error) {
                next(error);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const success = yield this.kegiatanRepository.delete(id);
                if (!success) {
                    return res.status(404).json({ status: 'error', message: 'Kegiatan not found' });
                }
                res.json({ status: 'success', message: 'Kegiatan deleted' });
            }
            catch (error) {
                next(error);
            }
        });
        this.uploadPoster = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (!req.file) {
                    return res.status(400).json({ status: 'error', message: 'No file uploaded' });
                }
                const posterUrl = `/uploads/${req.file.filename}`;
                const success = yield this.kegiatanRepository.updatePoster(id, posterUrl);
                if (!success) {
                    return res.status(404).json({ status: 'error', message: 'Kegiatan not found' });
                }
                res.json({ status: 'success', message: 'Poster uploaded', data: { poster: posterUrl } });
            }
            catch (error) {
                next(error);
            }
        });
        this.kegiatanRepository = new kegiatan_repository_1.KegiatanRepository();
    }
}
exports.KegiatanController = KegiatanController;
