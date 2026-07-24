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
exports.PesertaController = void 0;
const peserta_repository_1 = require("../repositories/peserta.repository");
class PesertaController {
    constructor() {
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const kegiatanId = req.query.kegiatan_id ? parseInt(req.query.kegiatan_id) : undefined;
                const search = req.query.search || '';
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const offset = (page - 1) * limit;
                const result = yield this.pesertaRepository.findAll(kegiatanId, search, limit, offset);
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
                const data = yield this.pesertaRepository.findById(id);
                if (!data) {
                    return res.status(404).json({ status: 'error', message: 'Peserta not found' });
                }
                res.json({ status: 'success', data });
            }
            catch (error) {
                next(error);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = yield this.pesertaRepository.create(req.body);
                res.status(201).json({ status: 'success', message: 'Peserta created', data: { id } });
            }
            catch (error) {
                next(error);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const success = yield this.pesertaRepository.update(id, req.body);
                if (!success) {
                    return res.status(404).json({ status: 'error', message: 'Peserta not found' });
                }
                res.json({ status: 'success', message: 'Peserta updated' });
            }
            catch (error) {
                next(error);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const success = yield this.pesertaRepository.delete(id);
                if (!success) {
                    return res.status(404).json({ status: 'error', message: 'Peserta not found' });
                }
                res.json({ status: 'success', message: 'Peserta deleted' });
            }
            catch (error) {
                next(error);
            }
        });
        this.pesertaRepository = new peserta_repository_1.PesertaRepository();
    }
}
exports.PesertaController = PesertaController;
