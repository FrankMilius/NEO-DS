#!/usr/bin/env node
// CommonJS mit Absicht: wird per createRequire aus lint-recipes.mjs geladen.
// Als .js in einem ESM-Paket war das ein ERR_REQUIRE_ESM — der Recipe-Linter
// fiel seit dem Wechsel still auf eine schwaechere Pruefung zurueck.
// ==========================================================================
// Lightweight JSON Schema Validator (Draft 2020-12 Subset)
// ==========================================================================
// Validates recipe JSON files against data/recipe-schema.json.
// No external dependencies — covers the subset used by our schema:
//   type, required, properties, additionalProperties, $ref/$defs,
//   pattern, enum, const, oneOf, minItems, minProperties, items
//
// This is NOT a full Draft 2020-12 implementation. It covers exactly
// what recipe-schema.json uses — nothing more, nothing less.
// ==========================================================================

'use strict';

/**
 * Validate a value against a JSON Schema node.
 *
 * @param {*} value - The value to validate
 * @param {Object} schema - Schema node
 * @param {string} path - JSON path for error messages
 * @param {Object} rootSchema - Root schema (for $ref resolution)
 * @returns {string[]} Array of error messages
 */
function validate(value, schema, path, rootSchema) {
  const errors = [];

  if (!schema || typeof schema !== 'object') return errors;

  // $ref resolution
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, rootSchema);
    if (!resolved) {
      errors.push(`${path}: $ref "${schema.$ref}" kann nicht aufgeloest werden`);
      return errors;
    }
    return validate(value, resolved, path, rootSchema);
  }

  // oneOf
  if (schema.oneOf) {
    const matches = schema.oneOf.filter(sub => {
      return validate(value, sub, path, rootSchema).length === 0;
    });
    if (matches.length === 0) {
      errors.push(`${path}: Kein oneOf-Branch passt`);
    }
    return errors;
  }

  // const
  if ('const' in schema) {
    if (value !== schema.const) {
      errors.push(`${path}: Erwartet const "${schema.const}", erhalten "${value}"`);
    }
    return errors;
  }

  // type check
  if (schema.type) {
    const typeValid = checkType(value, schema.type);
    if (!typeValid) {
      errors.push(`${path}: Erwartet Typ "${schema.type}", erhalten "${typeOfValue(value)}"`);
      return errors; // No point continuing if type is wrong
    }
  }

  // enum
  if (schema.enum) {
    if (!schema.enum.includes(value)) {
      errors.push(`${path}: Wert "${value}" nicht in enum [${schema.enum.join(', ')}]`);
    }
  }

  // pattern (string)
  if (schema.pattern && typeof value === 'string') {
    const re = new RegExp(schema.pattern);
    if (!re.test(value)) {
      errors.push(`${path}: "${value}" passt nicht auf Pattern /${schema.pattern}/`);
    }
  }

  // Object validations
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    // required
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in value)) {
          errors.push(`${path}: Pflichtfeld "${key}" fehlt`);
        }
      }
    }

    // minProperties
    if (schema.minProperties && Object.keys(value).length < schema.minProperties) {
      errors.push(`${path}: Mindestens ${schema.minProperties} Properties erwartet, ${Object.keys(value).length} vorhanden`);
    }

    // properties
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (key in value) {
          errors.push(...validate(value[key], propSchema, `${path}.${key}`, rootSchema));
        }
      }
    }

    // additionalProperties (validate unknown keys)
    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      const knownKeys = new Set(Object.keys(schema.properties || {}));
      for (const key of Object.keys(value)) {
        if (!knownKeys.has(key)) {
          errors.push(...validate(value[key], schema.additionalProperties, `${path}.${key}`, rootSchema));
        }
      }
    }
  }

  // Array validations
  if (Array.isArray(value)) {
    // minItems
    if (schema.minItems && value.length < schema.minItems) {
      errors.push(`${path}: Mindestens ${schema.minItems} Elemente erwartet, ${value.length} vorhanden`);
    }

    // items
    if (schema.items) {
      for (let i = 0; i < value.length; i++) {
        errors.push(...validate(value[i], schema.items, `${path}[${i}]`, rootSchema));
      }
    }
  }

  return errors;
}

/**
 * Resolve a $ref pointer against the root schema.
 * Supports: #/$defs/name
 */
function resolveRef(ref, rootSchema) {
  if (!ref.startsWith('#/')) return null;
  const parts = ref.slice(2).split('/');
  let current = rootSchema;
  for (const part of parts) {
    if (!current || typeof current !== 'object') return null;
    current = current[part];
  }
  return current;
}

/**
 * Check if value matches the expected type.
 */
function checkType(value, type) {
  if (type === 'null') return value === null;
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value);
  if (type === 'string') return typeof value === 'string';
  if (type === 'number' || type === 'integer') return typeof value === 'number';
  if (type === 'boolean') return typeof value === 'boolean';
  return true;
}

/**
 * Human-readable type name.
 */
function typeOfValue(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * Validate a recipe against the schema.
 *
 * @param {Object} recipe - Recipe JSON
 * @param {Object} schema - JSON Schema
 * @returns {string[]} Array of error messages (empty = valid)
 */
function validateAgainstSchema(recipe, schema) {
  return validate(recipe, schema, '$', schema);
}

module.exports = { validateAgainstSchema, validate };
